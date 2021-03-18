import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { CouponService } from './coupon.service';
import { CouponDto } from './dto/coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin'],
})
export class CouponController {
  constructor(private couponService: CouponService) {}

  @Get()
  public getCoupons() {
    return this.couponService.getAll();
  }

  @Post()
  public createCoupon(@Body(new SanitizePipe(CouponDto)) dto: CouponDto) {
    return this.couponService.create(dto);
  }
}
