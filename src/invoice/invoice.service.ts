import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Invoice, PaymentStatus } from './invoice.entity';
import { ProductService } from 'src/product/product.service';
import { Role, User } from 'src/user/user.entity';
import { App } from 'src/main';
import { Product } from 'src/product/product.entity';
import { UserService } from 'src/user/user.service';
import { InvoiceGateway } from './invoice.gateway';

@Injectable()
export class InvoiceService {
  public baseRelations: string[] = ['buyer', 'products', 'deliverer'];

  constructor(
    @InjectRepository(Invoice) private repo: Repository<Invoice>,
    private productService: ProductService,
    private userService: UserService,
    private invoiceGateway: InvoiceGateway,
  ) {
  }

  public async createInvoice(invoiceDto: any, user: User) {
    if (!invoiceDto.products || invoiceDto.products?.length === 0) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem produtos.',
      );
    }

    if (!user.address) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem que o usuário tenha um endereço de entrega.',
      );
    }

    invoiceDto.total = 0;

    for (let i = 0; i < invoiceDto.products.length; i++) {
      const product = await this.productService.getOne(
        invoiceDto.products[i].id,
      );

      invoiceDto.total += product.price;
    }

    if (invoiceDto.discount > invoiceDto.total) {
      throw new BadRequestException(
        'Não é possível criar uma venda que o desconto seja maior que o valor total.',
      );
    }

    invoiceDto.total = invoiceDto.total - invoiceDto.discount;

    try {
      const generatedInvoice = await this.repo.save(invoiceDto);
      const invoice = await this.getOne(generatedInvoice.id, {
        relations: this.baseRelations,
      });

      if (invoice) {
        await this.createInvoiceInPagarme(invoiceDto, user, invoice);
        return invoice;
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  public async acceptedByPagarme(body: any) {
    if (body.event === 'transaction_status_changed') {
      if (
        body.transaction &&
        body.transaction.status &&
        body.transaction.metadata &&
        body.transaction.metadata.invoice_id
      ) {
        const invoiceId = body.transaction.metadata.invoice_id;

        await this.repo.update(invoiceId, {
          paymentStatus: body.transaction.status,
          paymentDate: new Date(),
        });

        this.invoiceGateway.server.emit(
          'newInvoice',
          await this.getInvoice(invoiceId),
        );
      }
    }
  }

  public async createInvoiceInPagarme(
    invoiceDto: any,
    user: User,
    invoice: Invoice,
  ) {
    return App.client.transactions
      .create({
        amount: invoiceDto.total,
        card_id: invoiceDto.cardId,
        customer: {
          external_id: user.id,
          name: user.name,
          type: 'individual',
          country: 'br',
          email: user.email,
          documents: [
            {
              type: 'cpf',
              number: user.cpf,
            },
          ],
          phone_numbers: [`+55${user.phone}`],
        },
        capture: true,
        async: false,
        postback_url:
          'http://pharmago-backend.herokuapp.com/invoices/pagarme/accept',
        payment_method: 'credit_card',
        billing: {
          name: 'Local de entrega',
          address: {
            state: user.address.state,
            zipcode: user.address.zipcode,
            neighborhood: user.address.district,
            street_number: user.address.streetNumber.toString(),
            city: user.address.city,
            street: user.address.street,
            country: 'br',
          },
        },
        items: this.transformProductsToPagarmeItem(
          invoice.products.map(product => ({
            product,
            quantity: invoiceDto.products.find(
              productDto => productDto.id === product.id,
            ).quantity,
          })),
        ),
        metadata: {
          invoice_id: invoice.id,
        },
      })
      .catch((err: any) => {
        throw new BadRequestException(err.response.errors[0].message);
      });
  }

  public transformProductsToPagarmeItem(
    values: { product: Product; quantity: number }[],
  ): any[] {
    return values.map(value => ({
      id: value.product.id,
      title: value.product.name,
      unit_price: value.product.price,
      quantity: value.quantity,
      tangible: true,
    }));
  }

  public async updateInvoice(
    id: string,
    invoice: DeepPartial<Invoice>,
  ): Promise<Invoice> {
    await this.repo.update(id, invoice);
    return this.getOne(id, { relations: this.baseRelations });
  }

  public async getOne(id: string, options?: FindOneOptions): Promise<Invoice> {
    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<Invoice[]> {
    return this.repo.find({ relations: this.baseRelations });
  }

  // public async search(body: { from: Date; until: Date }) {
  //   return await this.repo.find({
  //     created_at: Between(body.from, body.until),
  //   });
  // }

  // public async searchInvoices(body: { title: string }): Promise<Invoice[]> {
  //   return await this.repo.find({
  //     relations: ['installments', 'products', 'seller', 'buyer'],
  //     where: `Invoice.title ILIKE '%${body.title}%'`,
  //   });
  // }

  public async getInvoice(id: string): Promise<Invoice> {
    return this.repo.findOne(id, {
      relations: this.baseRelations,
    });
  }

  public async acceptInvoice(id: string, user: User): Promise<Invoice> {
    if (user.role === Role.DEFAULT) {
      throw new BadRequestException(
        'Não é possível aceitar um pedido sem ser um entregador.',
      );
    }

    const invoice = await this.getInvoice(id);

    if (invoice.paymentStatus !== PaymentStatus.paid) {
      throw new BadRequestException(
        'Não é possível aceitar um pedido sem que ele esteja pago.',
      );
    }

    await this.repo.update(id, {
      deliverer: user,
      accepted: true,
    });

    return this.getInvoice(id);
  }

  public async invoiceDelivered(id: string, user: User): Promise<Invoice> {
    if (user.role === Role.DEFAULT) {
      throw new BadRequestException(
        'Não é possível marcar um pedido como entregue sem ser um entregador.',
      );
    }

    await this.repo.update(id, {
      delivered: true,
    });

    return this.getInvoice(id);
  }

  public async getRecentInvoices(user: User): Promise<Invoice[]> {
    return this.repo
      .createQueryBuilder('invoice')
      .innerJoinAndSelect('invoice.products', 'products')
      .where('invoice.buyer = :id', { id: user.id })
      .orderBy('invoice.paymentDate', 'DESC')
      .getMany();
  }
}
