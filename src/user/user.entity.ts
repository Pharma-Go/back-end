import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BCryptTransformer } from '../lib/bcrypt';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/base-entity';
import { Address } from 'src/address/address.entity';
import { Invoice } from 'src/invoice/invoice.entity';

export type Gender = 'M' | 'F';
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
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  invoices: Invoice[];
}
