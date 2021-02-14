import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from './invoice.entity';

export class InvoiceDto {
  @IsNumber()
  @Expose()
  discount: number;

  @IsEnum(PaymentMethod)
  @Expose()
  paymentMethod: PaymentMethod;

  @Expose()
  products: string[];

  @Expose()
  buyer: string;
}
