import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { AddressDto } from './address.dto';
import { AddressService } from './address.service';

@ApiTags('Address')
@Controller('addresses')
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
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  public createAddress(@Body(new SanitizePipe(AddressDto)) dto: AddressDto) {
    return this.addressService.createOne(dto);
  }
}
