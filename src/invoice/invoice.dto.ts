import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from './invoice.entity';

export class InvoiceDto {
  @IsNumber()
  @Expose()
  discount: number;

  @IsArray()
  @Expose()
  products: { id: string; quantity: number }[];

  @IsString()
  @Expose()
  buyer: string;

  @IsString()
  @Expose()
  cardId: string;

  @IsEnum(PaymentMethod)
  @Expose()
  paymentMethod: PaymentMethod;
}
