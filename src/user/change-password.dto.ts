import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ always: true })
  @Expose()
  currentPassword: string;

  @IsString({ always: true })
  @Expose()
  newPassword: string;

  @IsString({ always: true })
  @Expose()
  repeatedNewPassword: string;
}

export class ChangeRecoverPasswordDto {
  @IsString({ always: true })
  @Expose()
  code: string;

  @IsString({ always: true })
  @Expose()
  password: string;
}
