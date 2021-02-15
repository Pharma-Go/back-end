import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.entity';
import { CategoryService } from 'src/category/category.service';
import { EstablishmentDto } from 'src/establishment/establishment.dto';
import { EstablishmentService } from 'src/establishment/establishment.service';
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
}
