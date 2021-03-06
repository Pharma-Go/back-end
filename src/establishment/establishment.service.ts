import { Injectable } from '@nestjs/common';
import { Establishment } from './establishment.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentDto } from './dto/establishment.dto';

@Injectable()
export class EstablishmentService {
  public baseRelations: string[] = [
    'address',
    'products',
    'products.category',
    'products.establishment',
    'reviews',
  ];

  constructor(
    @InjectRepository(Establishment)
    private repo: Repository<Establishment>,
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
    user: DeepPartial<Establishment>,
  ): Promise<Establishment> {
    await this.repo.update(id, user);
    return this.getOne(id);
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
}
