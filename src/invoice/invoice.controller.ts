import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  OAuthActionsScope,
  OAuthPublic,
} from 'src/lib/decorators/oauth.decorator';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { InvoiceDto } from './invoice.dto';
import { User } from 'src/user/user.entity';
import { PagarmeService } from 'src/pagarme/pagarme.service';

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

  @Post('teste')
  public teste() {
    return this.service.teste();
  }

  @Get()
  public getAll() {
    return this.service.getAll();
  }

  @Post('/:id/sendDelivererLocation')
  public sendDelivererLocation(@Param('id') id: string) {
    return this.service.sendDelivererLocation(id);
  }

  @Get('recent')
  public getRecentInvoices(@CurrentUser() user: User) {
    return this.service.getRecentInvoices(user);
  }

  @Get('available/orders')
  public getAvailableOrders(@CurrentUser() user: User) {
    return this.service.getAvailableOrders(user);
  }

  @Get('stricteds')
  public getInvoicesStricteds(@CurrentUser() user: User) {
    return this.service.getInvoicesStricteds(user);
  }

  @Get('activeDelivery')
  public getActiveDelivery(@CurrentUser() user: User) {
    return this.service.getActiveDelivery(user);
  }

  @Get('myDeliveries')
  public getMyDeliveries(@CurrentUser() user: User) {
    return this.service.getMyDeliveries(user);
  }

  @Get(':id')
  public getOne(@Param('id') id: string) {
    return this.service.getOne(id, true);
  }

  @OAuthPublic()
  @Post('pagarme/postback')
  public acceptByPagarme(@Body() body: any) {
    return this.service.postback(body);
  }

  @Post('pagarme/:id/refund')
  public refundTransaction(@Param('id') id: string) {
    return this.service.refundTransaction(id);
  }

  @Put('strict/:id')
  public strictAccept(
    @Param('id') id: string,
    @Body() body: { accept: boolean },
    @CurrentUser() user: User,
  ) {
    return this.service.strictUpdate(id, body, user);
  }

  @Put('deliverer/:id/accept')
  public acceptInvoice(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.delivererAccept(id, user);
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
