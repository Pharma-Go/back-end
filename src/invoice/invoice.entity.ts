import { BaseEntity } from 'src/base-entity';
import { Card } from 'src/card/card.entity';
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
    default: PaymentStatus.pending,
  })
  paymentStatus: PaymentStatus;

  @Column({
    nullable: true,
  })
  paymentDate: Date;

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
}
