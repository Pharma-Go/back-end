import { BadRequestException, Injectable } from '@nestjs/common';
import { Role, User, userBaseRelations } from './user.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as BCrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import { UserDto } from './user.dto';
import { ChangePasswordDto } from './change-password.dto';
import { BCryptTransformer } from 'src/lib/bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UserService {
  public baseRelations: string[];

  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private mailerService: MailerService,
  ) {
    this.baseRelations = userBaseRelations;
  }

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
    return this.repo.findOne(user.id, {
      relations: this.baseRelations,
    });
  }

  public async updateUser(id: string, user: DeepPartial<User>): Promise<User> {
    await this.repo.update(id, user);
    return this.getOne(id);
  }

  public async getOne(id: string, options?: FindOneOptions): Promise<User> {
    if (!options) {
      options = {
        relations: this.baseRelations,
      };
    }

    return this.repo.findOne(id, options);
  }

  public async getAll(): Promise<User[]> {
    return this.repo.find({ relations: this.baseRelations });
  }

  public getAvailableDeliverers() {
    return this.repo.find({
      where: {
        available: true,
        role: Role.EMPLOYEE,
      },
    });
  }

  public async changePassword(user: User, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.repeatedNewPassword) {
      throw new BadRequestException('A senha deve se coincidir.');
    }

    const bcrypt = new BCryptTransformer();

    if (!bcrypt.compare(dto.currentPassword, user.password)) {
      throw new BadRequestException('A senha atual está incorreta.');
    }

    await this.repo.update(user.id, {
      password: dto.newPassword,
    });

    return this.getOne(user.id);
  }

  public async recoverPassword(email: string) {
    if (
      await this.repo
        .createQueryBuilder()
        .where('email = :email', { email })
        .getOne()
    ) {
      await this.mailerService.sendMail({
        to: email,
        from: 'noreply.pharmago@gmail.com',
        subject: 'Recuperação de senha',
        template: 'index',
      });

      return;
    }

    throw new BadRequestException('Não existe um usuário com este email.');
  }
}
