import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { Establishment } from './establishment.entity';
import { Crud } from '@nestjsx/crud';
import { OAuthActionsScope } from '../lib/decorators/oauth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';

@ApiTags('Vendors')
@Controller('vendors')
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin', 'default', 'default'],
  'Read-One': ['admin', 'default', 'default'],
  'Replace-One': ['admin'],
})
@Crud({
  model: {
    type: Establishment,
  },
  query: {
    join: {
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
export class VendorController {
  constructor(
    public readonly service: EstablishmentService,
  ) {
  }


  @Post('')
  public async createCategory(@Body() body: Establishment): Promise<Category> {
    body.products = body.products.map((product) => {
      return { id: product as unknown as string } as Product;
    });

    return this.service.createVendor(body);
  }

  @Put(':id')
  async putOne(
    @Param('id') id: string,
    @Body() vendor: Establishment,
  ) {
    return await this.service.updateVendor(id, vendor);
  }

}
