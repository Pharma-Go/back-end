import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AddressDto {
  @IsString({ always: true })
  @Expose()
  street: string;

  @IsString({ always: true })
  @Expose()
  district: string;

  @IsString()
  @Expose()
  streetNumber: string;

  @IsString({ always: true })
  @Expose()
  complement: string;

  @IsString({ always: true })
  @Expose()
  city: string;

  @IsString({ always: true })
  @Expose()
  state: string;

  @IsString({ always: true })
  @Expose()
  zipcode: string;

  @Expose()
  reference: string;

  @Expose()
  establishment: string;

  @Expose()
  user: string;
}
