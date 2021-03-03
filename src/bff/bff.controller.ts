import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { BffService } from './bff.service';

@ApiTags('BFF')
@Controller('bff')
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin'],
})
export class BffController {
  constructor(public readonly service: BffService) {}

  @Get('search/:term')
  public async search(@Param('term') term: string) {
    return this.service.search(term);
  }
}
