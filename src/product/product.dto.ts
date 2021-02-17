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

  @Expose()
  originalPrice: number;

  @IsBoolean()
  @Expose()
  available: boolean;

  imageUrl?: string;

  @Expose()
  category: string;

  @Expose()
  establishment: string;
}
