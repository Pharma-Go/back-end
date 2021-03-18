import { BaseEntity } from 'src/base-entity';
import { Column, Entity } from 'typeorm';

export enum CouponAction {
  DELIVERY_FEE = 'DELIVERY_FEE',
  TOTAL = 'TOTAL',
}

@Entity()
export class Coupon extends BaseEntity<Coupon> {
  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
    enum: [CouponAction.DELIVERY_FEE, CouponAction.TOTAL],
  })
  action: CouponAction;
}
