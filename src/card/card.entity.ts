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
  })
  method: PaymentMethod;

  @ManyToOne(
    () => User,
    user => user.cards,
  )
  user: User;
}
