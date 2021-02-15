import { Injectable } from '@nestjs/common';
import { Establishment } from './establishment.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentDto } from './establishment.dto';
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
      relations: ['address', 'products', 'categories'],
    });
  }
  public async updateEstablishment(
    id: string,
    user: DeepPartial<Establishment>,
  ): Promise<Establishment> {
    await this.repo.update(id, user);
    return this.getOne(id, {
      relations: ['address', 'categories', 'products'],
    });
  }

  public async getOne(
    id: string,
    options?: FindOneOptions,
  ): Promise<Establishment> {
    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<Establishment[]> {
    return this.repo.find({ relations: ['address', 'categories', 'products'] });
  }
}
