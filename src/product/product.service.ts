import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  public baseRelations: string[] = [
    'category',
    'establishment',
    'itemProducts',
    'reviews',
  ];

  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {
  }

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

    return this.getOne(product.id);
  }

  public async updateProduct(
    id: string,
    product: DeepPartial<Product>,
  ): Promise<Product> {
    await this.repo.update(id, product);
    return this.getOne(id);
  }

  public async getOne(id: string): Promise<Product> {
    return this.repo.findOne(id, { relations: this.baseRelations });
  }

  public async getAll(): Promise<Product[]> {
    return this.repo.find({ relations: this.baseRelations });
  }

  public async getHighlights(establishmentId: string): Promise<Product[]> {
    const products = await this.repo.find({
      relations: this.baseRelations,
      where: {
        establishment: establishmentId,
      },
    });

    const groupedBestProducts = products.reduce((acc, product) => {
      if (!acc.has(product.itemProducts.length)) {
        acc.set(product.itemProducts.length, []);
      }

      const productsMap = acc.get(product.itemProducts.length);
      productsMap.push(product);

      acc.set(product.itemProducts.length, productsMap);
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

  public async searchProducts(term: string): Promise<Product[]> {
    return this.repo.find({
      relations: this.baseRelations,
      where: `Product.name ILIKE '%${term}%'`,
    });
  }

  public async deleteOne(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
