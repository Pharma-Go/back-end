import {
  Controller,
  Get,
  Post,
  Body, Put, Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import {
  Crud,
} from '@nestjsx/crud';
import {
  OAuthPublic,
  OAuthActionsScope,
  CurrentUser,
} from '../lib/decorators/oauth.decorator';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { SanitizePipe } from '../lib/pipes/sanitize.pipe';
import { UserDto } from './user.dto';

@ApiTags('Users')
@Controller('users')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin',"default"],
  'Update-One': ['admin',"default"],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin', 'default'],
  'Read-One': ['admin', 'default'],
  'Replace-One': ['admin'],
})
export class UserController {
  constructor(public readonly service: UserService) {
  }

  @Post()
  async createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return await this.service.createUser(dto)
  }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
  
  @Put(':id')
  async putOne(
    @Param('id') id: string,
    @Body() user: User,
  ) {
    return await this.service.updateUser(id,user)
  }

}
