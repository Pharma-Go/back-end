import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  public async createProduct(dto: ProductDto): Promise<Product> {
    if (!dto.establishment) {
      throw new BadRequestException(
        'Não é possível criar um produto sem um estabelecimento.',
      );
    }

    if (!dto.category) {
      throw new BadRequestException(
        'Não é possível criar um produto sem uma categoria.',
      );
    }

    const product = await this.repo.save((dto as unknown) as Product);

    return this.getOne(product.id, {
      relations: ['establishment', 'category'],
    });
  }

  public async updateProduct(
    id: string,
    user: DeepPartial<Product>,
  ): Promise<Product> {
    await this.repo.update(id, user);
    return this.getOne(id, {
      relations: ['establishment', 'category'],
    });
  }

  public async getOne(id: string, options?: FindOneOptions): Promise<Product> {
    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<Product[]> {
    return this.repo.find({ relations: ['establishment', 'category'] });
  }

  public async getHighlights(establishmentId: string): Promise<Product[]> {
    const products = await this.repo.find({
      relations: ['invoices'],
      where: {
        establishment: establishmentId,
      },
    });

    const groupedBestProducts = products.reduce((acc, product) => {
      if (!acc.has(product.invoices.length)) {
        acc.set(product.invoices.length, []);
      }

      const productsMap = acc.get(product.invoices.length);
      productsMap.push(product);

      acc.set(product.invoices.length, productsMap);
      return acc;
    }, new Map<Number, Product[]>());

    let higherKey = 0;

    groupedBestProducts.forEach((_, key) => {
      if (key > higherKey) {
        higherKey = Number(key);
      }
    });

    return groupedBestProducts.get(higherKey);
  }
}
