import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AddressModule } from 'src/address/address.module';
import { CodeModule } from 'src/code/code.module';
import { OAuthModule } from 'src/oauth/oauth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AddressModule, CodeModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
