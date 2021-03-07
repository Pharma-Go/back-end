import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { AddressDto } from './address.dto';
import { Address } from './address.entity';
import { AddressService } from './address.service';

@ApiTags('Address')
@Controller('addresses')
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
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  public createAddress(@Body(new SanitizePipe(AddressDto)) dto: AddressDto) {
    return this.addressService.createOne(dto);
  }

  @Put(':id')
  public updateAddress(@Param('id') id: string, @Body() address: Address) {
    return this.addressService.updateAddress(id, address);
  }

  @Get(':cep')
  public getCep(@Param('cep') cep: string) {
    return this.addressService.getCep(cep);
  }
}
