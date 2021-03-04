import { BaseEntity } from 'src/base-entity';
import { PaymentMethod } from 'src/invoice/invoice.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Card extends BaseEntity<Card> {
  @Column({
    nullable: false,
  })
  card_id: string;

  @Column({
    nullable: false,
    enum: [PaymentMethod.CREDIT_CARD, PaymentMethod.CREDIT_CARD],
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
}
