import { Injectable } from '@nestjs/common';
import { Role, User } from './user.entity';
import { Equal, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { CrudService } from '../lib/crud-services/crud-services';
import { UserDto } from './user.dto';
import { Product } from '../product/product.entity';
import { Invoice } from '../invoice/invoice.entity';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);
  }

  async getByUsernameAndPassword(email: string, password: string) {
    const user = await this.repo.findOne({
      select: [
        'id',
        'email',
        'cpf',
        'password',
        'name',
        'role',
      ],
      where: [{ email}],
    });

    return user && BCrypt.compareSync(password, user.password)
      ? classToPlain(user)
      : null;
  }

  async createUser(dto: UserDto) {
    return await this.repo.save(dto);
  }

  public async updateUser(id: string, user: User): Promise<User> {

    return user;
  }
}
