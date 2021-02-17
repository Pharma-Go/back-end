import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class EstablishmentDto {
  @IsString({ always: true })
  @Expose()
  public name: string;

  @IsString({ always: true })
  @Expose()
  public phone: string;

  @Expose()
  public imageUrl?: string;

  @Expose()
  public products?: string[];

  @Expose()
  public address?: string;
}
