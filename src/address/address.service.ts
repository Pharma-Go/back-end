import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressDto } from './address.dto';
import { Address } from './address.entity';
import * as CeepCoords from 'coordenadas-do-cep';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private repo: Repository<Address>) {}

  public async createOne(dto: AddressDto): Promise<Address> {
    if (!dto.establishment && !dto.user) {
      throw new BadRequestException(
        'É obrigatório que o endereço tenha ou um estabelecimento ou um usuário',
      );
    }

    const address: Address = await this.repo.save((dto as unknown) as Address);

    return this.repo.findOne(address.id, {
      relations: ['user', 'establishment'],
    });
  }

  public async updateAddress(id: string, address: Address): Promise<Address> {
    await this.repo.update(id, address);

    return this.repo.findOne(address.id, {
      relations: ['user', 'establishment'],
    });
  }

  public async getCep(cep: string) {
    return CeepCoords.getByCep(cep);
  }
}
