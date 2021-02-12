import {
  Entity,
  Column,
  OneToMany,
  ManyToMany, ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { BCryptTransformer } from '../lib/bcrypt';
import { Exclude } from 'class-transformer';
import { Product } from 'src/product/product.entity';
import { Invoice } from 'src/invoice/invoice.entity';

export type Gender = 'M' | 'F';
export enum Role {
  ADMIN = 'admin',
  DEFAULT = 'default',
  DEFAULT = 'default',
}

@Entity()
export class User extends BaseEntity<User> {
  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    enum: ['M', 'F'],
  })
  gender: Gender;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Exclude()
  @Column({
    nullable: false,
    transformer: new BCryptTransformer(),
  })
  password: string;

  @Column({
    enum: [Role.ADMIN, Role.DEFAULT, Role.DEFAULT],
    default: Role.DEFAULT,
  })
  role: Role;

  @OneToMany(
    () => Product,
    product => product.createdBy,
  )
  products: Product[];

  @OneToMany(
    () => Invoice,
    invoice => invoice.seller,
  )
  madeInvoices: Invoice[];

  @OneToMany(
    () => Invoice,
    invoice => invoice.buyer,
  )
  purchasedInvoices: Invoice[];
}
