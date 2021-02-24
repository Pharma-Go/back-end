import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './invoice.entity';
import { InvoiceGateway } from './invoice.gateway';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), ProductModule, UserModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceGateway],
  exports: [InvoiceService],
})
export class InvoiceModule {}
