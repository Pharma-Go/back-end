import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import {
  CurrentUser,
  OAuthActionsScope,
  OAuthPublic,
} from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { User } from 'src/user/user.entity';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('product')
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
    type: Product,
  },
  query: {
    join: {
      vendor: {
        exclude: [],
      },
      category: {
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
export class ProductController {
  constructor(public readonly service: ProductService) {}

  @Get('')
  @OAuthPublic()
  async getProducts() {
    return this.service.getProducts();
  }

  @Post('')
  async createOne(
    @Body(new SanitizePipe(ProductDto)) dto: ProductDto,
    @CurrentUser() user: User,
  ) {
    dto.originalPrice = dto.price;

    return await this.service.createOneProduct(dto, user);
  }

  @Put(':id')
  async putOne(
    @Param('id') id: string,
    @Body() product: Product,
  ) {
    return await this.service.putOneProduct(id, product);
  }

  @Post('search')
  public async searchProduct(@Body() body: {term: string}): Promise<Product[]> {
    return await this.service.searchProduct(body);
  }
}
