import { Category } from 'src/category/category.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { User } from 'src/user/user.entity';
import { Establishment } from 'src/establishment/establishment.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Review } from 'src/review/review.entity';

@Entity()
export class Product extends BaseEntity<Product> {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
  })
  price: number;

  @Column({
    nullable: true,
  })
  originalPrice: number;

  @Column({
    nullable: false,
  })
  available: boolean;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @ManyToOne(
    () => Category,
    category => category.products,
  )
  category: Category;

  @ManyToOne(
    () => Establishment,
    establishment => establishment.products,
  )
  establishment: Establishment;

  @ManyToMany(
    () => Invoice,
    invoice => invoice.products,
  )
  invoices: Invoice[];

  @OneToMany(
    () => Review,
    review => review.product,
  )
  reviews: Review[];
}
