import { BaseEntity } from 'src/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Code extends BaseEntity<Code> {
  @Column({
    nullable: false,
  })
  code: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  expirationDate: Date;
}
