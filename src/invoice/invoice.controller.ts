import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { CurrentUser, OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { User } from 'src/user/user.entity';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';

@ApiTags('Invoice')
@Controller('invoice')
@OAuthActionsScope({
  'Create-Many': ['admin', 'default'],
  'Create-One': ['admin', 'default'],
  'Update-One': ['admin', 'default'],
  'Delete-All': ['admin', 'default'],
  'Delete-One': ['admin', 'default'],
  'Read-All': ['admin', 'default', 'default'],
  'Read-One': ['admin', 'default', 'default'],
  'Replace-One': ['admin', 'default'],
})
@Crud({
  model: {
    type: Invoice,
  },
  query: {
    join: {
      installments: {
        exclude: [],
      },
      sellers: {
        exclude: [],
      },
      buyers: {
        exclude: [],
      },
      products: {
        exclude: [],
      },
    },
  },
  params: {
    id: {
      type: 'string',
      field: 'id',
      primary: true,
    },
  },
})
export class InvoiceController {
  constructor(public readonly service: InvoiceService) {
  }

  @Post('')
  async createOne(@Body() body: any, @CurrentUser() user: User) {
    body.total = body.installments.reduce(
      (acc: any, value: any) => acc + value.price,
      0,
    );
    body.seller = { id: user.id } as User;

    body.products = body.products.map((product: any) => {
      return { id: product as unknown as string } as Product;
    });

    body.installments.forEach((installment: any) => {
      delete installment.invoice;
      delete installment.paymentMethod;
      delete installment.paymentStatus;
      delete installment.paymentDate;
    });

    return await this.service.createOneInvoice(body);
  }
  
  @Get(':id')
  public async getInvoice(@Param('id') id: string): Promise<Invoice> {
    return await this.service.getInvoice(id);
  }

  @Post('searchDates')
  public async searchBetweenDates(@Body() body: { from: Date, until: Date }) {
    return await this.service.search(body);
  }

  @Post('search')
  public async searchUsers(@Body() body: { title: string }): Promise<Invoice[]> {
    return await this.service.searchInvoices(body);
  }
}
