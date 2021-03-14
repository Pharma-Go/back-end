import 'dotenv/config';

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
import { ScheduleModule } from '@nestjs/schedule';
import { AddressModule } from './address/address.module';
import { CardController } from './card/card.controller';
import { CardModule } from './card/card.module';
import { ReviewModule } from './review/review.module';
import { CouponModule } from './coupon/coupon.module';
import { MediaModule } from './media/media.module';
import { MailModule } from './mail/mail.module';
import { BffModule } from './bff/bff.module';
import { ItemProductModule } from './item-product/item-product.module';
import { CodeModule } from './code/code.module';
import { PagarmeModule } from './pagarme/pagarme.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    ReviewModule,
    EstablishmentModule,
    OAuthModule,
    UserModule,
    AddressModule,
    ProductModule,
    CategoryModule,
    InvoiceModule,
    CardModule,
    CouponModule,
    MediaModule,
    MailModule,
    BffModule,
    ItemProductModule,
    CodeModule,
    PagarmeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
