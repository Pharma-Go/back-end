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

export type Gender = 'M' | 'F' | 'X';
export enum Role {
  ADMIN = 'admin',
  DEFAULT = 'default',
}

@Entity()
export class User extends BaseEntity<User> {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    enum: ['M', 'F', 'X'],
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
  cpf: string;

  @Exclude()
  @Column({
    nullable: false,
    transformer: new BCryptTransformer(),
  })
  password: string;

  @Column({
    enum: [Role.ADMIN, Role.DEFAULT],
    default: Role.DEFAULT,
  })
  role: Role;

  @OneToOne(() => Address)
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
    () => Card,
    card => card.user,
  )
  cards: Card[];
}
