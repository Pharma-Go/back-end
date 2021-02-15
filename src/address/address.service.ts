import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDto } from './address.dto';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private repo: Repository<Address>) {}

  public createOne(dto: AddressDto): Promise<Address> {
    return this.repo.save(dto);
  }
}
