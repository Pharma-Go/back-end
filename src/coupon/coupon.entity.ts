import { BaseEntity } from 'src/base-entity';
import { User } from 'src/user/user.entity';
import { Column, Entity } from 'typeorm';

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
}
