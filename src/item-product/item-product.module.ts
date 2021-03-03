import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemProduct } from './item-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemProduct])],
})
export class ItemProductModule {}
