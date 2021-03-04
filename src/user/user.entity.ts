import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BCryptTransformer } from '../lib/bcrypt';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/base-entity';
import { Address } from 'src/address/address.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Card } from 'src/card/card.entity';
import { Review } from 'src/review/review.entity';

import { Establishment } from 'src/establishment/establishment.entity';
import { Product } from 'src/product/product.entity';

export enum Role {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  DEFAULT = 'employee',
}

export const userBaseRelations: string[] = [
  'address',
  'cards',
  'deliveries',
  'invoices',
  'favoriteEstablishments',
  'favoriteProducts',
];

@Entity()
export class User extends BaseEntity<User> {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    default: false,
  })
  available: boolean;

  @Column({
    nullable: false,
    unique: true,
  })
  cpf: string;

  @Exclude()
  @Column({
    nullable: false,
    transformer: new BCryptTransformer(),
  })
  password: string;

  @Column({
    enum: [Role.ADMIN, Role.EMPLOYEE, Role.DEFAULT],
    default: Role.DEFAULT,
  })
  role: Role;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  @Column({
    nullable: false,
  })
  phone: string;

  @OneToMany(
    () => Invoice,
    invoice => invoice.buyer,
  )
  invoices: Invoice[];

  @OneToMany(
    () => Invoice,
    invoice => invoice.deliverer,
  )
  deliveries: Invoice[];

  @OneToMany(
    () => Card,
    card => card.user,
  )
  cards: Card[];

  @OneToMany(
    () => Review,
    review => review.author,
  )
  reviews: Review[];

  @ManyToMany(
    () => Establishment,
    establishment => establishment.favoriteUsers,
    {
      cascade: true,
    },
  )
  @JoinTable()
  favoriteEstablishments: Establishment[];

  @ManyToMany(
    () => Product,
    product => product.favoriteUsers,
    {
      cascade: true,
    },
  )
  @JoinTable()
  favoriteProducts: Product[];
}
