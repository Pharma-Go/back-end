import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/main';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CardDto } from './card.dto';
import { Card } from './card.entity';
import { PagarmeCard } from './card.model';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private repo: Repository<Card>,
    private userService: UserService,
  ) {}

  public async createCard(cardDto: CardDto, user: User): Promise<Card> {
    const pagarmeCardDto = { ...cardDto };
    delete pagarmeCardDto.method;

    const pagarmeCard: PagarmeCard = await App.client.cards
      .create(pagarmeCardDto)
      .catch((err: any) => {
        throw new BadRequestException(err.response.errors[0].message);
      });

    const card = await this.repo.save(({
      card_id: pagarmeCard.id,
      method: cardDto.method,
      user: user.id,
      firstDigits: pagarmeCard.first_digits,
      lastDigits: pagarmeCard.last_digits,
    } as unknown) as Card);

    this.userService.updateUser(user.id, user);

    return card;
  }

  public async getCards(user: User) {
    const pagarmeCards = await App.client.cards.all();

    const cards = [];

    for (const userCard of user.cards) {
      const pagarmeCard = pagarmeCards.find(
        (pagarmeCard: PagarmeCard) => pagarmeCard.id === userCard.card_id,
      );

      cards.push({
        ...userCard,
        first_digits: pagarmeCard.first_digits,
        last_digits: pagarmeCard.last_digits,
      });
    }

    return cards;
  }

  public async getCard(cardId: string): Promise<PagarmeCard> {
    const card = await App.client.cards.find({ id: cardId }).catch(err => {
      throw new BadRequestException(err.response.errors);
    });

    if (!card) {
      throw new BadRequestException(
        'Não foi possível achar um cartão com o id ' + cardId,
      );
    }

    return card;
  }

  public async deleteCard(cardId: string, user: User): Promise<void> {
    // user.cards = user.cards.filter(card => card !== cardId);
    this.userService.updateUser(user.id, user);
    return;
  }
}
