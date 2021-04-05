import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
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

  public async getCategoryMostBuyed(user: User) {
    // `SELECT c.name, count(i.id) FROM category c
    // INNER JOIN product p ON p.category_id = c.id
    // INNER JOIN item_product ip ON ip.product_id = p.id
    // INNER JOIN invoice_item_products_item_product invp ON invp.item_product_id = ip.id
    // INNER JOIN invoice i ON i.id = invp.invoice_id
    // GROUP BY c.name
    // ORDER BY count DESC
    // LIMIT 1
    // `;

    return this.repo
      .createQueryBuilder('c')
      .select(['c.name', 'c.id', 'count(inv.id)'])
      .innerJoin('c.products', 'p')
      .innerJoin('p.itemProducts', 'ip')
      .innerJoin('ip.product', 'invp')
      .innerJoin(
        'invoice_item_products_item_product',
        'i',
        'i.item_product_id = ip.id',
      )
      .innerJoin('invoice', 'inv', 'inv.id = i.invoice_id')
      .where('inv.buyer = :id', { id: user.id })
      .groupBy('c.id')
      .orderBy('count', 'DESC')
      .getOne();
  }
}
