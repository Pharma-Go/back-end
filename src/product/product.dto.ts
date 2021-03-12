import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({ always: true })
  @Expose()
  name: string;

  @IsString({ always: true })
  @Expose()
  description: string;

  @IsNumber()
  @Expose()
  price: number;

  @IsBoolean()
  @Expose()
  strict: boolean;

  @IsBoolean()
  @Expose()
  available: boolean;

  imageUrl?: string;

  @IsString({ always: true })
  @Expose()
  category: string;

  @IsString({ always: true })
  @Expose()
  establishment: string;
}
