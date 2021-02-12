import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { User } from 'src/user/user.entity';
import { Like, Repository } from 'typeorm';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService extends CrudService<Product> {
  constructor(@InjectRepository(Product) repo: Repository<Product>) {
    super(repo);
  }

  public async getProducts() {
    return await this.repo.find({
      relations: ['category', 'vendor'],
    });
  }

  public async createOneProduct(
    product: ProductDto,
    user: User,
  ): Promise<Product> {
    const newProduct: any = {
      ...product,
    };

    delete newProduct.category;
    delete newProduct.vendor;

    newProduct.createdBy = { id: user.id };

    if (product.category !== '') {
      newProduct.category = { id: product.category };
    }

    if (product.vendor !== '') {
      newProduct.vendor = { id: product.vendor };
    }

    return await this.repo.save((newProduct as unknown) as Product);
  }

  public async putOneProduct(id: string, product: Product): Promise<Product> {
    const newProduct: any = {
      ...product,
    };

    delete newProduct.category;
    delete newProduct.vendor;

    if (product.category) {
      newProduct.category = { id: product.category };
    }

    await this.repo.update(id, (newProduct as unknown) as Product);
    return newProduct;
  }

  public async searchProduct(body: { term: string }): Promise<Product[]> {
    return await this.repo.find({
      relations: ['category', 'vendor'],
      where: `Product.name ILIKE '%${body.term}%'`,
    });
  }

  public async updateProd(id: string, quantity: number): Promise<Product> {
    const product: Product = await this.repo.findOne(id);

    if (product.quantity === 0) {
      throw new BadRequestException(
        `Não há este produto "${product.name}" em estoque`,
      );
    }

    if (product.quantity - quantity < 0) {
      throw new BadRequestException(
        `Não há quantia suficiente deste produto "${product.name}" em estoque`,
      );
    }

    return await this.repo.save({
      ...product,
      quantity: product.quantity - quantity,
    });
  }

  public async getOneProduct(id: string): Promise<Product> {
    return await this.repo.findOne(id);
  }
}
