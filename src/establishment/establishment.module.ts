import { Module } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from './establishment.entity';
import { EstablishmentController } from './establishment.controller';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment]), ProductModule],
  controllers: [EstablishmentController],
  providers: [EstablishmentService],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}
