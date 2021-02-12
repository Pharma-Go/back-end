import "dotenv/config"

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { EstablishmentModule } from './establishment/establishment.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InstallmentModule } from './installment/installment.module';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    EstablishmentModule,
    OAuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    InvoiceModule,
    InstallmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
