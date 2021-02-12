import { Optional } from '@nestjs/common';
import { Expose, Type, TypeHelpOptions } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/category/category.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { User } from 'src/user/user.entity';
import { Establishment } from 'src/establishment/establishment.entity';

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

  originalPrice: number;

  @IsNumber()
  @Expose()
  quantity: number;

  @IsString({ always: true })
  @Expose()
  dimension: string;

  @IsString({ always: true })
  @Expose()
  imageUrl: string;

  @IsString({ always: true })
  @Expose()
  category: string;

  @IsString({ always: true })
  @Expose()
  vendor: string;
}
