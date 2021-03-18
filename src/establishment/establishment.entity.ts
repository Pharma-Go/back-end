import { Address } from 'src/address/address.entity';
import { Category } from 'src/category/category.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
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

  @Column({
    nullable: true,
    default: 5,
  })
  fee: number;

  @Column({
    nullable: true,
    default: 5000,
  })
  maxDistance: number;

  @Column({
    nullable: true,
    default: 200,
  })
  deliveryFeePerKm: number;

  @OneToMany(
    () => Product,
    product => product.establishment,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
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

  @ManyToOne(
    () => User,
    user => user.establishments,
    {
      cascade: true,
    },
  )
  owner: User;

  @ManyToMany(
    () => User,
    user => user.favoriteEstablishments,
  )
  favoriteUsers: User[];

  @OneToMany(
    () => Invoice,
    invoice => invoice.establishment,
    {
      cascade: true,
    },
  )
  invoices: Invoice[];
}
