import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/lib/crud-services/crud-services';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

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
