import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { AddressController } from './address/address.controller';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    OAuthModule,
    AddressModule
  ],
  controllers: [AppController, AddressController],
  providers: [AppService],
})
export class AppModule {}
