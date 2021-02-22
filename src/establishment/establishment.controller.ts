import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { Establishment } from './establishment.entity';
import { OAuthActionsScope } from '../lib/decorators/oauth.decorator';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { EstablishmentDto } from './dto/establishment.dto';

@ApiTags('Establishment')
@Controller('establishment')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'default'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin', 'default'],
})
export class EstablishmentController {
  constructor(public readonly service: EstablishmentService) {}

  @Post()
  public createEstablishment(
    @Body(new SanitizePipe(EstablishmentDto)) dto: EstablishmentDto,
  ) {
    return this.service.createEstablishment(dto);
  }

  @Get()
  public getAll() {
    return this.service.getAll();
  }

  @Get('mostRated')
  public getMostRated() {
    return this.service.getMostRated();
  }

  @Get(':id')
  public getOne(@Param('id') id: string) {
    return this.service.getOne(id, {
      relations: ['address', 'products', 'reviews'],
    });
  }

  @Put(':id')
  public putOne(@Param('id') id: string, @Body() user: Establishment) {
    return this.service.updateEstablishment(id, user);
  }

  @Get('search/:term')
  public searchEstablishment(@Param('term') term: string) {
    return this.service.searchEstablishment(term);
  }
}
