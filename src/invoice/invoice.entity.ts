import { BaseEntity } from 'src/base-entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

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
    nullable: false,
  })
  title: string;

  @ManyToOne(
    () => User,
    user => user.madeInvoices,
    {
      cascade: true,
    },
  )
  seller: User;

  @ManyToOne(
    () => User,
    user => user.purchasedInvoices,
    {
      cascade: true,
    },
  )
  buyer: User;

  @JoinTable()
  @ManyToMany(
    () => Product,
    product => product.invoices,
    {
      cascade: true,
    },
  )
  products: Product[];
}
