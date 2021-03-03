import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from './invoice.entity';

export class InvoiceDto {
  @IsNumber()
  @Expose()
  discount: number;

  @IsArray()
  @Expose()
  itemProducts: {
    product: { id: string };
    quantity: number;
    prescriptionUrl?: string;
  }[];

  @IsString()
  @Expose()
  buyer: string;

  @Expose()
  deliverer: string;

  @IsString()
  @Expose()
  cardId: string;

  @IsEnum(PaymentMethod)
  @Expose()
  paymentMethod: PaymentMethod;
}
