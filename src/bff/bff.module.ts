import { Module } from '@nestjs/common';
import { BffService } from './bff.service';
import { BffController } from './bff.controller';
import { EstablishmentModule } from 'src/establishment/establishment.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [EstablishmentModule, ProductModule],
  providers: [BffService],
  controllers: [BffController],
  exports: [BffService],
})
export class BffModule {}
