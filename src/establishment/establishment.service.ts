import { Injectable } from '@nestjs/common';
import { Establishment } from './establishment.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentDto } from './dto/establishment.dto';
import { Review } from 'src/review/review.entity';
@Injectable()
export class EstablishmentService {
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

    return this.getOne(establishment.id, {
      relations: ['address'],
    });
  }

  public async updateEstablishment(
    id: string,
    user: DeepPartial<Establishment>,
  ): Promise<Establishment> {
    await this.repo.update(id, user);
    return this.getOne(id, {
      relations: ['address', 'products'],
    });
  }

  public async getOne(
    id: string,
    options?: FindOneOptions,
  ): Promise<Establishment> {
    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<Establishment[]> {
    return this.repo.find({ relations: ['products'] });
  }

  public searchEstablishment(term: string): Promise<Establishment[]> {
    return this.repo.find({
      relations: ['products', 'address'],
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
