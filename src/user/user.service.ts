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

  async getByUsernameAndPassword(username: string, password: string) {
    const user = await this.repo.findOne({
      select: [
        'id',
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'role',
      ],
      where: [{ username }, { email: username }],
    });

    return user && BCrypt.compareSync(password, user.password)
      ? classToPlain(user)
      : null;
  }

  async createUser(dto: UserDto) {
    return await this.repo.save(dto);
  }

  public async getBestSeller(): Promise<User> {
    // TODO: Fix this query

    const users = await this.repo.find({
      relations: ['madeInvoices'],
    });

    const bestSellerInd = {
      value: 0,
      user: null,
    };

    users.forEach((user, index) => {
      if (user.madeInvoices) {
        if (user.madeInvoices.length > bestSellerInd.value) {
          bestSellerInd.value = user.madeInvoices.length;
          bestSellerInd.user = user;
        }
      }
    });

    return bestSellerInd.user;
  }

  public async updateUser(id: string, user: User): Promise<User> {
    const newUser: User = {
      ...user,
    };

    delete newUser.madeInvoices;
    delete newUser.purchasedInvoices;
    delete newUser.products;
    delete newUser.id;

    if (newUser.madeInvoices) {
      if (newUser.madeInvoices.length === 0) {
        newUser.madeInvoices = null;
      } else {
        newUser.madeInvoices = user.madeInvoices.map(invoice => {
          return { id: (invoice as unknown) as string } as Invoice;
        });
      }
    }

    await this.repo.save({ ...newUser, id });
    return newUser;
  }

  public async searchUsers(body: { username: string }): Promise<User[]> {
    return await this.repo.find({
      relations: ['madeInvoices', 'products'],
      where: `User.username ILIKE '%${body.username}%'`,
    });
  }
}
