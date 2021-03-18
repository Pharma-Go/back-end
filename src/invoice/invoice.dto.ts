import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentMethod } from './invoice.entity';

export class InvoiceDto {
  @IsNumber()
  @Expose()
  discount: number;

  @IsNumber()
  @Expose()
  deliveryFeeAmount: number;

  @IsArray()
  @Expose()
  itemProducts: {
    product: { id: string };
    quantity: number;
    prescriptionUrl?: string;
  }[];

  @Expose()
  deliverer: string;

  @IsString()
  @Expose()
  paymentCard: string;

  @IsString()
  @Expose()
  establishment: string;

  @IsEnum(PaymentMethod)
  @Expose()
  paymentMethod: PaymentMethod;

  public total: number;
  public buyer: string;
  public strictAccepted: boolean;
}
