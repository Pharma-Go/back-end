import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { Establishment } from './establishment.entity';
import {
  CurrentUser,
  OAuthActionsScope,
} from '../lib/decorators/oauth.decorator';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { EstablishmentDto } from './dto/establishment.dto';
import { User } from 'src/user/user.entity';

@ApiTags('Establishment')
@Controller('establishment')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin', 'employee', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'employee', 'default'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin', 'employee', 'default'],
})
export class EstablishmentController {
  constructor(public readonly service: EstablishmentService) {}

  @Post()
  public createEstablishment(
    @Body(new SanitizePipe(EstablishmentDto)) dto: EstablishmentDto,
  ) {
    return this.service.createEstablishment(dto);
  }

  @Post(':id/products')
  public addProducts(
    @Param('id') id: string,
    @Body() dto: { products: string[] },
  ) {
    return this.service.updateProducts(id, dto.products);
  }

  @Delete(':id')
  public removeEstablishment(@Param('id') id: string) {
    return this.service.removeEstablishment(id);
  }

  @Delete(':id/products')
  public removeProducts(
    @Param('id') id: string,
    @Body() dto: { products: string[] },
  ) {
    return this.service.updateProducts(id, dto.products, false);
  }

  @Get()
  public getAll() {
    return this.service.getAll();
  }

  @Get('mostRated')
  public getMostRated() {
    return this.service.getMostRated();
  }

  @Get('suggestions')
  public getSuggestions(@CurrentUser() user: User) {
    return this.service.getSuggestions(user);
  }

  @Get('my')
  public getMyEstablishments(@CurrentUser() user: User) {
    return this.service.getMyEstablishments(user);
  }

  @Get(':id')
  public getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Put(':id')
  public putOne(@Param('id') id: string, @Body() establishment: Establishment) {
    return this.service.updateEstablishment(id, establishment);
  }

  @Get('search/:term')
  public searchEstablishment(@Param('term') term: string) {
    return this.service.searchEstablishment(term);
  }
}
