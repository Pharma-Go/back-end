import { BaseEntity } from 'src/base-entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export enum PaymentStatus {
  PAID = 'PAID',
  REFUSED = 'REFUSED',
  PENDING = 'PENDING',
}

@Entity()
export class Invoice extends BaseEntity<Invoice> {
  @Column({
    nullable: false,
  })
  total: number;

  @Column({
    nullable: true,
    default: 0,
  })
  discount: number;

  @Column({
    nullable: true,
    enum: ['PENDING', 'REFUSED', 'PAID'],
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    nullable: false,
    enum: ['CREDIT_CARD', 'DEBIT_CARD'],
  })
  paymentMethod: PaymentMethod;

  @ManyToMany(
    () => Product,
    product => product.invoices,
    {
      cascade: true,
    },
  )
  @JoinTable()
  products: Product[];

  @ManyToOne(
    () => User,
    user => user.invoices,
  )
  buyer: User;
}
