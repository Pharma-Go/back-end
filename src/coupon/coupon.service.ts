import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';
import { CouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(@InjectRepository(Coupon) private repo: Repository<Coupon>) {}

  public getAll() {
    return this.repo.find();
  }

  public async create(dto: CouponDto) {
    const coupon = await this.repo.save(dto);

    return this.repo.findOne(coupon.id);
  }
}
