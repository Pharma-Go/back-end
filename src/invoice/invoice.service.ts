import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Between, Like, Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class InvoiceService extends CrudService<Invoice> {
  constructor(
    @InjectRepository(Invoice) repo: Repository<Invoice>,
    private productService: ProductService,
  ) {
    super(repo);
  }

  public async createOneInvoice(invoice: any): Promise<Invoice> {
    const quantities: any = invoice.quantities;

    console.log(quantities);

    for (const product of invoice.products) {
      if (quantities && quantities.hasOwnProperty(product.id)) {
        await this.productService
          .updateProd(product.id, quantities[product.id])
          .catch(error => {
            throw new BadRequestException(error);
          });
      } else {
        throw new BadRequestException(
          'Não foi possível verificar a quantidade disponível do produto ' +
            (await this.productService.getOneProduct(product.id)).name,
        );
      }
    }

    return await this.repo.save(invoice);
  }

  public async search(body: { from: Date; until: Date }) {
    return await this.repo.find({
      created_at: Between(body.from, body.until),
    });
  }

  public async searchInvoices(body: { title: string }): Promise<Invoice[]> {
    return await this.repo.find({
      relations: ['installments', 'products', 'seller', 'buyer'],
      where: `Invoice.title ILIKE '%${body.title}%'`,
    });
  }

  public async getInvoice(id: string): Promise<Invoice> {
    return await this.repo.findOne({
      relations: ['products', 'installments', 'seller', 'buyer'],
      where: {
        id: id,
      },
    });
  }
}
