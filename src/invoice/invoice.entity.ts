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


  @JoinTable()
  @ManyToMany(
    () => Product,
    product => product.invoices,
    {
      cascade: true,
    },
  )
  products: Product[];

  @ManyToOne(
    () => User,
    user => user.invoices,
  )
  buyer: User;
}
