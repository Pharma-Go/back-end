import { BadRequestException, Injectable } from '@nestjs/common';
import { EstablishmentService } from 'src/establishment/establishment.service';
import { ProductService } from 'src/product/product.service';
import { SearchResponseDto } from './search-response.dto';

@Injectable()
export class BffService {
  constructor(
    private establishmentService: EstablishmentService,
    private productService: ProductService,
  ) {}

  public async search(term: string): Promise<SearchResponseDto> {
    const obj: any = {
      establishments: [],
      products: [],
    };

    const establishments = await this.establishmentService
      .searchEstablishment(term)
      .catch(err => {
        throw new BadRequestException(err);
      });

    if (establishments && establishments.length > 0) {
      obj.establishments = establishments;
    }

    const products = await this.productService
      .searchProducts(term)
      .catch(err => {
        throw new BadRequestException(err);
      });

    if (products && products.length > 0) {
      obj.products = products;
    }

    return obj;
  }
}
