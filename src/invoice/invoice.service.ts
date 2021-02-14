import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceDto } from './invoice.dto';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/user.entity';
import { App } from 'src/main';
import { Product } from 'src/product/product.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private repo: Repository<Invoice>,
    private productService: ProductService,
  ) {}

  public async testPagarme() {
    // const transaction = await client.transactions.create({});
    // console.log(transaction);
  }

  public async createInvoice(
    invoiceDto: InvoiceDto,
    user: User,
    cardId: string,
  ) {
    if (!invoiceDto.products || invoiceDto.products?.length === 0) {
      throw new BadRequestException(
        'Não é possível criar uma venda sem produtos.',
      );
    }

    const newInvoice: Invoice = (invoiceDto as unknown) as Invoice;
    newInvoice.total = 0;

    for (let productId of invoiceDto.products) {
      const product = await this.productService.getOne(productId);
      newInvoice.total += product.price;
    }

    if (invoiceDto.discount > newInvoice.total) {
      throw new BadRequestException(
        'Não é possível criar uma venda que o desconto seja maior que o valor total.',
      );
    }

    newInvoice.total = newInvoice.total - newInvoice.discount;

    const generatedInvoice = await this.repo.save(newInvoice);
    const invoice = await this.getOne(generatedInvoice.id, {
      relations: ['products', 'buyer'],
    });

    if (generatedInvoice) {
      const transaction = await App.client.transactions
        .create({
          amount: newInvoice.total,
          card_id: cardId,
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
          items: this.transformProductsToPagarmeItem(invoice.products),
        })
        .catch(err => console.log('erro', err.response));

      console.log(transaction);
    }

    return invoice;
  }

  public transformProductsToPagarmeItem(products: Product[]): any[] {
    return products.map(product => ({
      id: product.id,
      title: product.name,
      unit_price: product.price,
      quantity: product.quantity,
      tangible: true,
    }));
  }

  public async updateInvoice(
    id: string,
    invoice: DeepPartial<Invoice>,
  ): Promise<Invoice> {
    await this.repo.update(id, invoice);
    return this.getOne(id, { relations: ['products', 'buyer'] });
  }

  public async getOne(id: string, options?: FindOneOptions): Promise<Invoice> {
    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<Invoice[]> {
    return this.repo.find({ relations: ['products', 'buyer'] });
  }
  // throw new BadRequestException(
  //   'Não foi possível verificar a quantidade disponível do produto ' +
  //     (await this.productService.getOneProduct(product.id)).name,
  // );

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
    return await this.repo.findOne(id, {
      relations: ['products', 'installments', 'seller', 'buyer'],
    });
  }
}
