import { Establishment } from 'src/establishment/establishment.entity';
import { Product } from 'src/product/product.entity';
import { Entity, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';

// import { Product } from '../product/product.entity';
@Entity()
export class Category extends BaseEntity<Category> {
  @Column({
    nullable: false,
  })
  name: string;

  @OneToMany(
    () => Product,
    product => product.category,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  products: Product[];
}
