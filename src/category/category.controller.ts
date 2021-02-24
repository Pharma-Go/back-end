import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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
  'Read-All': ['admin', 'employee', 'default', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default', 'employee', 'default'],
  'Replace-One': ['admin'],
})
export class CategoryController {
  constructor(public readonly service: CategoryService) {}

  @Get(':id')
  public async getCategory(@Param('id') id: string) {
    return this.service.getCategory(id);
  }

  @Post('')
  public async createCategory(@Body() body: Category): Promise<Category> {
    return this.service.createCategory(body);
  }

  @Put(':id')
  async putOne(@Param('id') id: string, @Body() category: Category) {
    return await this.service.updateCategory(id, category);
  }
}
