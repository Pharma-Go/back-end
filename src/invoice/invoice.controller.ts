import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
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
  'Create-One': ['admin', 'employee', 'default'],
  'Update-One': ['admin', 'employee', 'default'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin', 'employee', 'default'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin', 'employee', 'default'],
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

  @Get('recent')
  public getRecentInvoices(@CurrentUser() user: User) {
    return this.service.getRecentInvoices(user);
  }

  @Get(':id')
  public getOne(@Param('id') id: string) {
    return this.service.getOne(id, { relations: ['products', 'buyer'] });
  }

  @Get('pagarme/accept')
  public acceptByPagarme(@Query('postback_url') postback: any) {
    console.log(postback);
    this.service.acceptedByPagarme();
  }

  @Put('deliverer/:id/accept')
  public acceptInvoice(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.acceptInvoice(id, user);
  }

  @Put('/:id/delivered')
  public invoiceDelivered(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.invoiceDelivered(id, user);
  }

  @Put(':id')
  public putOne(@Param('id') id: string, @Body() invoice: Invoice) {
    return this.service.updateInvoice(id, invoice);
  }
}
