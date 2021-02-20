import { Address } from 'src/address/address.entity';
import { Category } from 'src/category/category.entity';
import { Review } from 'src/review/review.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
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
  imageUrl: string;

  @Column({
    nullable: false,
  })
  opensAt: string;

  @Column({
    nullable: false,
  })
  closesAt: string;

  @OneToMany(
    () => Product,
    product => product.establishment,
  )
  products: Product[];

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @OneToMany(
    () => Review,
    review => review.establishment,
  )
  reviews: Review[];
}
