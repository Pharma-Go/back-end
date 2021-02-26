import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  public async getCategories(): Promise<Category[]> {
    return this.repo.find({ relations: ['products'] });
  }

  public getCategory(id: string): Promise<Category> {
    return this.repo.findOne(id, { relations: ['products'] });
  }

  public async createCategory(body: Category): Promise<Category> {
    return await this.repo.save(body);
  }

  public async updateCategory(
    id: string,
    category: Category,
  ): Promise<Category> {
    return this.repo.save({ category, id });
  }
}
