import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { User } from 'src/user/user.entity';
import { CardDto } from './card.dto';
import { Card } from './card.entity';
import { CardService } from './card.service';

@ApiTags('Cards')
@Controller('cards')
export class CardController {
  constructor(private service: CardService) {}

  @Get('me')
  @ApiCreatedResponse({
    status: 201,
    description: 'Retorna um array de cartões',
    type: [Card],
  })
  public getCards(@CurrentUser() user: User) {
    return this.service.getCards(user);
  }

  @Get(':id')
  public getCard(@Param('id') cardId: string) {
    return this.service.getCard(cardId);
  }

  @Post('')
  public createCard(
    @Body(new SanitizePipe(CardDto)) card: CardDto,
    @CurrentUser() user: User,
  ) {
    return this.service.createCard(card, user);
  }

  @Delete(':id')
  public deleteCard(@Param('id') cardId: string, @CurrentUser() user: User) {
    return this.service.deleteCard(cardId, user);
  }
}
