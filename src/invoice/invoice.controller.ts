import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  OAuthActionsScope,
} from 'src/lib/decorators/oauth.decorator';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { InvoiceDto } from './invoice.dto';
import { User } from 'src/user/user.entity';
@ApiTags('Invoice')
@Controller('invoices')
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
export class InvoiceController {
  constructor(public readonly service: InvoiceService) {}

  @Post()
  public createInvoice(
    @Body(new SanitizePipe(InvoiceDto)) dto: InvoiceDto,
    @CurrentUser() user: User,
  ) {
    return this.service.createInvoice(dto, user);
  }

  @Get()
  public getAll() {
    return this.service.getAll();
  }

  @Get('recents')
  public getRecentsInvoices(@CurrentUser() user: User) {
    return this.service.getRecentsInvoices(user);
  }

  @Get(':id')
  public getOne(@Param('id') id: string) {
    return this.service.getOne(id, { relations: ['products', 'buyer'] });
  }

  @Put(':id')
  public putOne(@Param('id') id: string, @Body() invoice: Invoice) {
    return this.service.updateInvoice(id, invoice);
  }
}
