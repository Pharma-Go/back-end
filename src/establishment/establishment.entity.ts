import { Address } from 'src/address/address.entity';
import { Category } from 'src/category/category.entity';
import { Entity, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
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

  @OneToMany(
    () => Product,
    product => product.vendor,
  )
  products: Product[];

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @ManyToOne(
    () => Category,
    category => category.establishments,
  )
  category: Category;
}