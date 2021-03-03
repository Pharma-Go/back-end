import { Establishment } from 'src/establishment/establishment.entity';
import { Product } from 'src/product/product.entity';

export interface SearchResponseDto {
  establishments: Establishment[];
  products: Product[];
}
