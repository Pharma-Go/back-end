import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  BadRequestException,
  Delete,
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
import {
  ChangePasswordDto,
  ChangeRecoverPasswordDto,
} from './change-password.dto';

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
  @Post('requestRecoverPassword/:email')
  public requestRecoverPassword(@Param('email') email: string) {
    return this.service.requestRecoverPassword(email);
  }

  @OAuthPublic()
  @Post('changeRecoverPassword/:email')
  public changeRecoverPassword(
    @Param('email') email: string,
    @Body(new SanitizePipe(ChangeRecoverPasswordDto))
    dto: ChangeRecoverPasswordDto,
  ) {
    return this.service.changeRecoverPassword(email, dto);
  }

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

  @Post('establishment/:id/favorite')
  public addFavorite(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.addFavorite(user.id, id);
  }

  @Delete('establishment/:id/favorite')
  public removeFavorite(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.removeFavorite(user.id, id);
  }

  @Get('')
  public getAll() {
    return this.service.getAll();
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
