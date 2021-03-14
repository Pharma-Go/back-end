import { BaseEntity } from 'src/base-entity';
import { Card } from 'src/card/card.entity';
import { Establishment } from 'src/establishment/establishment.entity';
import { ItemProduct } from 'src/item-product/item-product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export enum PaymentStatus {
  paid = 'paid',
  refused = 'refused',
  pending = 'pending',
  refunded = 'refunded',
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
    enum: [
      PaymentStatus.paid,
      PaymentStatus.pending,
      PaymentStatus.refunded,
      PaymentStatus.refused,
    ],
    default: PaymentStatus.pending,
  })
  paymentStatus: PaymentStatus;

  @Column({
    nullable: true,
  })
  refunded: Date;

  @Column({
    nullable: true,
  })
  paymentDate: Date;

  @Column({
    nullable: true,
    default: false,
  })
  isFee: boolean;

  @Column({
    nullable: true,
  })
  feeAmount: number;

  @Column({
    nullable: true,
  })
  transactionId: number;

  @Column({
    nullable: false,
    default: false,
  })
  strictAccepted: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  delivererAccepted: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  delivered: boolean;

  @ManyToMany(
    () => ItemProduct,
    product => product.invoices,
    {
      cascade: true,
    },
  )
  @JoinTable()
  itemProducts: ItemProduct[];

  @ManyToOne(
    () => User,
    user => user.invoices,
  )
  buyer: User;

  @ManyToOne(
    () => User,
    user => user.deliveries,
  )
  deliverer: User;

  @ManyToOne(
    () => Card,
    card => card.invoices,
  )
  paymentCard: Card;

  @ManyToOne(
    () => Establishment,
    establishment => establishment.invoices,
  )
  establishment: Establishment;
}
