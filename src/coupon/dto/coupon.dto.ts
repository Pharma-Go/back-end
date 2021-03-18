import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CouponAction } from '../coupon.entity';

export class CouponDto {
  @IsString({ always: true })
  @Expose()
  title: string;

  @IsNumber()
  @Expose()
  price: number;

  @IsEnum(CouponAction)
  @Expose()
  action: CouponAction;
}
