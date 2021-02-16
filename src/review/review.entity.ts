import { BaseEntity } from 'src/base-entity';
import { Establishment } from 'src/establishment/establishment.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Review extends BaseEntity<Review> {
  @ManyToOne(
    () => Establishment,
    establishment => establishment.reviews,
  )
  establishment: Establishment;

  @ManyToOne(
    () => Product,
    product => product.reviews,
  )
  product: Product;

  @ManyToOne(
    () => User,
    user => user.reviews,
  )
  author: User;

  @Column({
    nullable: true,
  })
  comment: string;

  @Column({
    nullable: false,
  })
  stars: number;
}
