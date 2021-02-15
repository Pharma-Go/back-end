import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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

  @IsString({ always: true })
  @Expose()
  method: string;
}
