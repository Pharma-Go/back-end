import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OAuthActionsScope } from 'src/lib/decorators/oauth.decorator';
import { SanitizePipe } from 'src/lib/pipes/sanitize.pipe';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
@OAuthActionsScope({
  'Create-Many': ['admin'],
  'Create-One': ['admin'],
  'Update-One': ['admin'],
  'Delete-All': ['admin'],
  'Delete-One': ['admin'],
  'Read-All': ['admin', 'employee', 'default'],
  'Read-One': ['admin', 'employee', 'default'],
  'Replace-One': ['admin'],
})
export class ProductController {
  constructor(public readonly service: ProductService) {}

  @Get('')
  async getProducts() {
    return this.service.getAll();
  }

  @Get('search/:term')
  public async searchProduct(@Param('term') term: string): Promise<Product[]> {
    return await this.service.searchProducts(term);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Get(':establishment/highlights')
  public getHighlights(@Param('establishment') establishmentId: string) {
    return this.service.getHighlights(establishmentId);
  }

  @Post()
  async createOne(@Body(new SanitizePipe(ProductDto)) dto: ProductDto) {
    return await this.service.createProduct(dto);
  }

  @Put(':id')
  async putOne(@Param('id') id: string, @Body() product: Product) {
    return await this.service.updateProduct(id, product);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return await this.service.deleteOne(id);
  }
}
