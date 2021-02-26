import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  BadRequestException,
} from '@nestjs/common';
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
import { ChangePasswordDto } from './change-password.dto';

@ApiTags('Users')
@Controller('users')
@ApiOAuth2(['public'])
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin', 'employee', 'default'],
  'Update-One': ['admin', 'employee', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'employee', 'default'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin', 'employee', 'default'],
})
export class UserController {
  constructor(public readonly service: UserService) {}

  @OAuthPublic()
  @Post()
  public createUser(@Body(new SanitizePipe(UserDto)) dto: UserDto) {
    return this.service.createUser(dto);
  }

  @Post('changePassword')
  public changePassword(
    @Body(new SanitizePipe(ChangePasswordDto)) dto: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    return this.service.changePassword(user, dto);
  }

  @Get('')
  public getAll() {
    return this.service.getAll();
  }

  @OAuthPublic()
  @Get('recoverPassword/:email')
  public recoverPassword(@Param('email') email: string) {
    return this.service.recoverPassword(email);
  }

  @Get('availableDeliverers')
  public getAvailableDeliverers() {
    return this.service.getAvailableDeliverers();
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
