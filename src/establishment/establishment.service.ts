import { Injectable } from '@nestjs/common';
import { Establishment } from './establishment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../lib/crud-services/crud-services';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class EstablishmentService extends CrudService<Establishment> {
  constructor(
    @InjectRepository(Establishment)
      repo: Repository<Establishment>,
  ) {
    super(repo);
  }

  public async createVendor(body: Establishment): Promise<Establishment> {
    return await this.repo.save(body);
  }

  public async updateVendor(id: string, vendor: Establishment): Promise<Category> {
    const newVendor: Establishment = {
      ...vendor,
    };

    delete newVendor.products;

    newVendor.products = vendor.products.map((product) => {
      return { id: product as unknown as string } as Product;
    });


    if (newVendor.products.length === 0) {
      newVendor.products = null;
    }

    await this.repo.save({ ...newVendor, id });
    return newVendor;
  }
}
