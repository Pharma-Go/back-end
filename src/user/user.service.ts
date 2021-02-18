import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { UserDto } from './user.dto';
import { AddressService } from 'src/address/address.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private addressService: AddressService,
  ) {}

  async getByUsernameAndPassword(email: string, password: string) {
    const user = await this.repo.findOne({
      select: ['id', 'email', 'cpf', 'password', 'name', 'role'],
      where: [{ email }],
    });

    return user && BCrypt.compareSync(password, user.password)
      ? classToPlain(user)
      : null;
  }

  public async createUser(dto: UserDto): Promise<User> {
    if (!dto.cpf) {
      throw new BadRequestException('CPF é obrigatório');
    }

    if (await this.repo.findOne({ where: { cpf: dto.cpf } })) {
      throw new BadRequestException('Este cpf já está cadastrado.');
    }

    const user = await this.repo.save({ ...dto, cards: [] });

    return this.getOne(user.id);
  }

  public async getMe(user: User): Promise<User> {
    return this.repo.findOne(user.id);
  }

  public async updateUser(id: string, user: DeepPartial<User>): Promise<User> {
    await this.repo.update(id, user);
    return this.getOne(id);
  }

  public async getOne(id: string, options?: FindOneOptions): Promise<User> {
    if (!options) {
      options = {
        relations: ['address', 'cards'],
      };
    }

    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<User[]> {
    return this.repo.find({ relations: ['address', 'cards'] });
  }
}
