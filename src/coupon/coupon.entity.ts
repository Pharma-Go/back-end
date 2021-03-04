import { BaseEntity } from 'src/base-entity';
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
