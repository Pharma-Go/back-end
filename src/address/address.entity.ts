import {
    Entity,
    Column,
    OneToOne,
  } from 'typeorm';
  import { BaseEntity } from 'src/base-entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Address extends BaseEntity<Address>{
    @Column({
        nullable: false
    })
    street:string;

    @Column({
        nullable: false
    })
    district:string

    @Column({
        nullable: false
    })
    streetNumber:number

    @Column({
        nullable: false
    })
    complement:string

    @Column({
        nullable: false
    })
    city:string

    @Column({
        nullable: false
    })
    reference:string

    @OneToOne(() => User,(user:User) => user.address)
    user:User
    
}