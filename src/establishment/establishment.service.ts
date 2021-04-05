import { Injectable } from '@nestjs/common';
import { Establishment } from './establishment.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentDto } from './dto/establishment.dto';
import { ProductService } from 'src/product/product.service';
import { User, userBaseRelations } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/category.entity';

@Injectable()
export class EstablishmentService {
  public baseRelations: string[] = [
    'address',
    'products',
    'products.category',
    'products.establishment',
    'reviews',
    'owner',
  ];

  constructor(
    @InjectRepository(Establishment)
    private repo: Repository<Establishment>,
    private productService: ProductService,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  public async createEstablishment(
    dto: EstablishmentDto,
  ): Promise<Establishment> {
    const establishment = await this.repo.save(
      (dto as unknown) as Establishment,
    );

    return this.getOne(establishment.id);
  }

  public async updateEstablishment(
    id: string,
    establishmentDto: DeepPartial<Establishment>,
  ): Promise<Establishment> {
    await this.repo.update(id, establishmentDto);
    return this.getOne(id);
  }

  public async updateProducts(
    establishmentId: string,
    products: string[],
    add: boolean = true,
  ): Promise<Establishment> {
    const establishment = await this.getOne(establishmentId);

    for (const productId of products) {
      const product = await this.productService.getOne(productId);

      if (add) {
        await this.repo
          .createQueryBuilder('Establishment')
          .relation('products')
          .of(establishment)
          .add(product);
      } else {
        await this.repo
          .createQueryBuilder('Establishment')
          .relation('products')
          .of(establishment)
          .remove(product);
      }
    }

    return this.getOne(establishmentId);
  }

  public async getOne(id: string): Promise<Establishment> {
    return this.repo.findOne(id, { relations: this.baseRelations });
  }

  public async getAll(): Promise<Establishment[]> {
    return this.repo.find();
  }

  public searchEstablishment(term: string): Promise<Establishment[]> {
    return this.repo.find({
      relations: this.baseRelations,
      where: `Establishment.name ILIKE '%${term}%'`,
    });
  }

  public async getMostRated(limit?: number) {
    const query = this.repo
      .createQueryBuilder('est')
      .innerJoinAndSelect('est.reviews', 'reviews')
      .orderBy('reviews.stars', 'DESC')
      .leftJoinAndSelect('est.address', 'address');

    if (limit) {
      return query.limit(limit).getMany();
    }

    return query.getMany();
  }

  public async getMyEstablishments(user: User) {
    return this.repo.find({
      relations: this.baseRelations,
      where: {
        owner: user.id,
      },
    });
  }

  public async removeEstablishment(id: string) {
    return this.repo.delete(id);
  }

  public async getBestEstablishmentByCategory(user: User) {
    return this.repo
      .createQueryBuilder('e')
      .addSelect(['count(p.category_id)'])
      .leftJoinAndSelect('e.address', 'address')
      .innerJoin('e.invoices', 'inv')
      .innerJoin(
        'invoice_item_products_item_product',
        'ipp',
        'ipp.invoice_id = inv.id',
      )
      .innerJoin('item_product', 'ip', 'ip.id = ipp.item_product_id')
      .innerJoin('product', 'p', 'p.id = ip.product_id')
      .innerJoin('category', 'c', 'c.id = p.category_id')
      .where('inv.buyer_id = :id', { id: user.id })
      .groupBy('c.id')
      .addGroupBy('e.id')
      .addGroupBy('address.id')
      .orderBy('count', 'DESC')
      .limit(3)
      .getMany();
  }

  public async getSuggestions({ id }: User) {
    const user = await this.userService.getOne(id, {
      relations: [
        ...userBaseRelations,
        'invoices.itemProducts',
        'invoices.itemProducts.product',
        'invoices.itemProducts.product.category',
      ],
    });

    const invoices = user.invoices;

    if (invoices && invoices.length > 0) {
      return this.getBestEstablishmentByCategory(user);
    }

    return this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.invoices', 'invoices')
      .leftJoinAndSelect('e.address', 'address')
      .orderBy('invoices', 'DESC')
      .limit(3)
      .getMany();
  }
}
