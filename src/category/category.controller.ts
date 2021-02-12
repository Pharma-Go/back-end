import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { Product } from '../product/product.entity';
import { ProductService } from '../product/product.service';

@ApiTags('Categories')
@Controller('category')
@ApiOAuth2(['public'])
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
    type: Category,
  },
  query: {
    join: {
      products: {
        exclude: ['id'],
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
export class CategoryController {
  constructor(public readonly service: CategoryService, public readonly productService: ProductService) {
  }

  @Post('')
  public async createCategory(@Body() body: Category): Promise<Category> {
    body.products = body.products.map((product) => {
      return { id: product as unknown as string } as Product;
    });

    return this.service.createCategory(body);
  }

  @Put(':id')
  async putOne(
    @Param('id') id: string,
    @Body() category: Category,
  ) {
    return await this.service.updateCategory(id, category);
  }
}
