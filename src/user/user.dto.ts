import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsIn, IsEnum } from 'class-validator';
import { AddressDto } from 'src/address/address.dto';
import { Address } from 'src/address/address.entity';
import { Gender, Role } from './user.entity';

export class UserDto {
  @IsString({ always: true })
  @Expose()
  name: string;

  @IsIn(['M', 'F'], {
    always: true,
  })
  @IsString({ always: true })
  @Expose()
  gender: Gender;

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
