import { BaseEntity } from 'src/base-entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}
@Entity()
export class Card extends BaseEntity<Card> {
  @Column({
    nullable: false,
  })
  card_id: string;

  @Column({
    nullable: false,
    enum: [PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD],
  })
  method: PaymentMethod;

  @Column({
    nullable: false,
  })
  firstDigits: string;

  @Column({
    nullable: false,
  })
  lastDigits: string;

  @ManyToOne(
    () => User,
    user => user.cards,
  )
  user: User;

  @OneToMany(
    () => Invoice,
    invoice => invoice.paymentCard,
  )
  invoices: Invoice[];
}
