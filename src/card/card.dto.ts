import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { PaymentMethod } from 'src/invoice/invoice.entity';

export class CardDto {
  @IsString({ always: true })
  @Expose()
  card_number: string;

  @IsString({ always: true })
  @Expose()
  card_expiration_date: string;

  @IsString({ always: true })
  @Expose()
  card_holder_name: string;

  @IsString({ always: true })
  @Expose()
  card_cvv: string;

  @IsEnum(PaymentMethod)
  @Expose()
  method: string;
}
