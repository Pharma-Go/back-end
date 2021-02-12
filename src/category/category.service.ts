import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class CategoryService extends CrudService<Category> {
  constructor(@InjectRepository(Category) repo: Repository<Category>) {
    super(repo);
  }

  public async createCategory(body: Category): Promise<Category> {
    return await this.repo.save(body);
  }

  public async updateCategory(id: string, category: Category): Promise<Category> {
    const newCategory: Category = {
      ...category,
    };

    delete newCategory.products;

    newCategory.products = category.products.map((product) => {
      return { id: product as unknown as string } as Product;
    });


    if (newCategory.products.length === 0) {
      newCategory.products = null;
    }

    await this.repo.save({ ...newCategory, id });
    return newCategory;
  }
}

