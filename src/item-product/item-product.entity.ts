import { BaseEntity } from 'src/base-entity';
import { Invoice } from 'src/invoice/invoice.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class ItemProduct extends BaseEntity<ItemProduct> {
  @Column({
    nullable: true,
  })
  public prescriptionUrl?: string;

  @Column({
    nullable: false,
  })
  public price: number;

  @Column({
    nullable: false,
  })
  public quantity: number;

  @ManyToOne(
    () => Product,
    product => product.itemProducts,
  )
  public product: Product;

  @ManyToMany(
    () => Invoice,
    invoice => invoice.itemProducts,
  )
  public invoices: Invoice[];
}
