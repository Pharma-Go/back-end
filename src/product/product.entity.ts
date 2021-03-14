import { Category } from 'src/category/category.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Establishment } from 'src/establishment/establishment.entity';
import { Entity, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Review } from 'src/review/review.entity';
import { ItemProduct } from 'src/item-product/item-product.entity';
import { User } from 'src/user/user.entity';

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
    nullable: false,
  })
  available: boolean;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @Column({
    nullable: false,
    default: true,
  })
  strict: boolean;

  @ManyToOne(
    () => Category,
    category => category.products,
  )
  category: Category;

  @ManyToOne(
    () => Establishment,
    establishment => establishment.products,
    {
      onDelete: 'CASCADE',
    },
  )
  establishment: Establishment;

  @OneToMany(
    () => Review,
    review => review.product,
  )
  reviews: Review[];

  @OneToMany(
    () => ItemProduct,
    itemProduct => itemProduct.product,
  )
  itemProducts: ItemProduct[];

  @ManyToMany(
    () => User,
    user => user.favoriteProducts,
  )
  favoriteUsers: User[];
}
