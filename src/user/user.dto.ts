import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsIn, IsEnum } from 'class-validator';
import { Role } from './user.entity';

export class UserDto {
  @IsString({ always: true })
  @Expose()
  name: string;

  @Expose()
  imageUrl: string;

  @IsEmail()
  @IsString({ always: true })
  @Expose()
  email: string;

  @IsString({ always: true })
  @Expose()
  cpf: string;

  @IsString({ always: true })
  @Expose()
  phone: string;

  @IsString({ always: true })
  @Expose()
  password: string;

  @IsEnum(Role)
  @Expose()
  role: Role;
}
