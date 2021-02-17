import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  @Expose()
  author: string;

  @IsString()
  @Expose()
  comment: string;

  @IsNumber()
  @Expose()
  stars: number;
}
