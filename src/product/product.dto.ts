import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @Expose()
  quantity: number;

  imageUrl?: string;

  @Expose()
  category: string;

  @Expose()
  establishment: string;
}
