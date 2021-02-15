import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CardController } from './card.controller';
import { Card } from './card.entity';
import { CardService } from './card.service';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), UserModule],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
