import { Address } from 'src/address/address.entity';
import { Category } from 'src/category/category.entity';
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

  @OneToMany(
    () => Product,
    product => product.establishment,
  )
  products: Product[];

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @JoinTable()
  @ManyToMany(
    () => Category,
    category => category.establishments,
    {
      cascade: true,
    },
  )
  categories: Establishment[];
}
