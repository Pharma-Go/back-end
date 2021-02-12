import { Injectable } from '@nestjs/common';
import { Role, User } from './user.entity';
import { Equal, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async getByEmailAndPassword(email: string, password: string) {
    const user = await this.repo.findOne({
      select: [],
      where: [{ email }],
    });

    return user && BCrypt.compareSync(password, user.password)
      ? classToPlain(user)
      : null;
  }

  async getOne(uuid: string) {
    return await this.repo.findOne(uuid);
  }

  async createUser(dto: UserDto) {
    return this.repo.save(dto);
  }

  async updateUser(uuid: string, user: User) {
    return await this.repo.update(uuid, user);
  }
}
