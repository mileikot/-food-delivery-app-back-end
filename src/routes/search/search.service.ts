import { Injectable } from '@nestjs/common';

import { SearchDto } from './dto/search.dto';

import { PopulatedProductDto } from '@/products/dto/populated-product.dto';
import { ProductsService } from '@/products/products.service';

@Injectable()
export class SearchService {
  constructor(private readonly productService: ProductsService) {}

  async search(searchDto: SearchDto): Promise<PopulatedProductDto[]> {
    const { query } = searchDto;

    return this.productService.findAll({
      title: { $regex: query, $options: 'i' },
    });
  }
}
