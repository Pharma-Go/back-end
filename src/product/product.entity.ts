import { Category } from 'src/category/category.entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { User } from 'src/user/user.entity';
import { Establishment } from 'src/establishment/establishment.entity';
import { Entity, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../base-entity';

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
  quantity: number;

  @Column({
    nullable: false,
  })
  dimension: string;

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
    vendor => vendor.products,
  )
  vendor: Establishment;

  @ManyToMany(
    () => Invoice,
    invoice => invoice.products,
  )
  invoices: Invoice[];
}
