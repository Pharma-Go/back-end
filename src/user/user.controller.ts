import { Controller, Get, Post, Body, Put, Param, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  OAuthPublic,
  OAuthActionsScope,
  CurrentUser,
} from '../lib/decorators/oauth.decorator';
import { ApiTags, ApiOAuth2, ApiCreatedResponse } from '@nestjs/swagger';
import { SanitizePipe } from '../lib/pipes/sanitize.pipe';
import { UserDto } from './user.dto';
import { CardDto } from 'src/card/card.dto';
import { PagarmeCard } from 'src/card/card.model';

@ApiTags('Users')
@Controller('users')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin', 'default'],
  'Update-One': ['admin', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'default'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin', 'default'],
})
export class UserController {
  constructor(public readonly service: UserService) {}

  @OAuthPublic()
  @Post()
  public createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return this.service.createUser(dto);
  }

  @Get('')
  public getAll() {
    return this.service.getAll();
  }

  @Get('me')
  public getMe(@CurrentUser() user: User) {
    return this.service.getMe(user);
  }

  @Get(':id')
  public getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Put(':id')
  public putOne(@Param('id') id: string, @Body() user: User) {
    return this.service.updateUser(id, user);
  }
}
