import { Injectable } from '@nestjs/common';
import { Establishment } from './establishment.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentDto } from './dto/establishment.dto';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/user/user.entity';

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

  public async getMostRated() {
    return (
      await this.repo
        .createQueryBuilder('est')
        .innerJoinAndSelect('est.reviews', 'reviews')
        .orderBy('reviews.stars', 'DESC')
        .leftJoinAndSelect('est.address', 'address')
        .getMany()
    ).slice(0, 3);
  }

  public async getMyEstablishments(user: User) {
    return this.repo.find({
      relations: this.baseRelations,
      where: {
        owner: user.id,
      },
    });
  }
}
