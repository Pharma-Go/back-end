import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Invoice, PaymentStatus } from './invoice.entity';
import { ProductService } from 'src/product/product.service';
import { Role, User } from 'src/user/user.entity';
import { App } from 'src/main';
import { Product } from 'src/product/product.entity';
import { InvoiceGateway } from './invoice.gateway';
import { InvoiceDto } from './invoice.dto';

@Injectable()
export class InvoiceService {
  public baseRelations: string[] = [
    'buyer',
    'itemProducts',
    'deliverer',
    'itemProducts.product',
    'paymentCard',
  ];

  constructor(
    @InjectRepository(Invoice) private repo: Repository<Invoice>,
    private productService: ProductService,
    private invoiceGateway: InvoiceGateway,
  ) {}

  public async createInvoice(invoiceDto: InvoiceDto, user: User) {
    if (!invoiceDto.itemProducts || invoiceDto.itemProducts?.length === 0) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem produtos.',
      );
    }

    if (!user.address) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem que o usuário tenha um endereço de entrega.',
      );
    }

    invoiceDto['total'] = 0;
    invoiceDto['strictAccepted'] = true;

    for (let i = 0; i < invoiceDto.itemProducts.length; i++) {
      const product = await this.productService.getOne(
        invoiceDto.itemProducts[i].product.id,
      );

      if (product.strict) {
        invoiceDto['strictAccepted'] = false;

        if (!invoiceDto.itemProducts[i].prescriptionUrl) {
          throw new BadRequestException(
            `É obrigatório prescrição médica para o produto ${product.name}`,
          );
        }
      }

      const price = product.price * invoiceDto.itemProducts[i].quantity;

      invoiceDto.itemProducts[i]['price'] = price;
      invoiceDto['total'] += price;
    }

    if (invoiceDto.discount > invoiceDto['total']) {
      throw new BadRequestException(
        'Não é possível criar uma venda que o desconto seja maior que o valor total.',
      );
    }

    invoiceDto['total'] = invoiceDto['total'] - invoiceDto.discount;
    console.log(invoiceDto);

    try {
      const generatedInvoice = await this.repo.save(invoiceDto as unknown);
      const invoice = await this.getOne(generatedInvoice.id);

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

        if (invoiceId) {
          try {
            await this.repo.update(invoiceId, {
              paymentStatus: body.transaction.status,
              paymentDate: new Date(),
            });

            const invoice = await this.getInvoice(invoiceId);

            console.log(invoice.strictAccepted);

            if (invoice.strictAccepted) {
              this.invoiceGateway.server.emit('updateInvoice', invoice);
              console.log('emitiu');
              this.emitNewInvoice(invoice);
            }
          } catch (err) {
            throw new BadRequestException(err);
          }
        }
      }
    }
  }

  public async emitNewInvoice(invoice: Invoice) {
    this.invoiceGateway.server.emit('newInvoice', invoice.id);
  }

  public async createInvoiceInPagarme(
    invoiceDto: any,
    user: User,
    invoice: Invoice,
  ) {
    try {
      return App.client.transactions.create({
        amount: invoiceDto.total,
        card_id: invoice.paymentCard.card_id,
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
        async: true,
        postback_url:
          'http://pharmago-backend.herokuapp.com/invoices/pagarme/accept',
        payment_method: invoice.paymentCard.method.toLowerCase(),
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
          invoice.itemProducts.map(itemProduct => {
            const product: Product = itemProduct.product;

            return {
              product: product,
              quantity: invoiceDto.itemProducts.find(
                itemProduct => itemProduct.product.id === product.id,
              ).quantity,
            };
          }),
        ),
        metadata: {
          invoice_id: invoice.id,
        },
      });
    } catch (err) {
      throw new BadRequestException(err.response.errors[0].message);
    }
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
    return this.getOne(id);
  }

  public async getOne(id: string, getBuyerAddress?: boolean): Promise<Invoice> {
    let relations = [...this.baseRelations];

    if (getBuyerAddress) {
      relations = [...this.baseRelations, 'buyer.address'];
    }

    return this.repo.findOne(id, { relations });
  }

  public async getAll(): Promise<Invoice[]> {
    return this.repo.find({ relations: this.baseRelations });
  }

  public async getInvoice(id: string): Promise<Invoice> {
    return this.repo.findOne(id, {
      relations: this.baseRelations,
    });
  }

  public async delivererAccept(id: string, user: User): Promise<Invoice> {
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

    try {
      await this.repo.update(id, {
        deliverer: user,
        delivererAccepted: true,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    this.invoiceGateway.server.emit('delivererAccept', id);

    return this.getInvoice(id);
  }

  public async strictUpdate(
    id: string,
    body: { accept: boolean },
    user: User,
  ): Promise<Invoice> {
    if (user.role !== Role.ADMIN) {
      throw new BadRequestException(
        'Não é possível aceitar um pedido sem ser um admin.',
      );
    }

    await this.repo.update(id, {
      strictAccepted: body.accept,
    });

    const invoice = await this.getInvoice(id);

    this.invoiceGateway.server.emit('strictAccept', invoice);

    if (invoice.paymentStatus === PaymentStatus.paid) {
      this.emitNewInvoice(invoice);
    }

    return invoice;
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
      .innerJoinAndSelect('invoice.itemProducts', 'products')
      .where('invoice.buyer = :id', { id: user.id })
      .orderBy('invoice.paymentDate', 'DESC')
      .limit(3)
      .getMany();
  }

  public sendDelivererLocation(invoiceId: string) {
    this.invoiceGateway.server.emit('gpsToClient', {
      invoiceId,
      lngLat: [-46.627628803253174, -23.614166392779463],
    });
  }
}
