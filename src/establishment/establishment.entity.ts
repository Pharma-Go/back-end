 import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Product } from '../product/product.entity';

@Entity()
export class Establishment extends BaseEntity<Establishment> {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  email: string;

  @OneToMany(
    () => Product,
    product => product.vendor,
  )
  products: Product[];
}

