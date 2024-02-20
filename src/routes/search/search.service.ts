import { Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { Product } from '../products/product.entity';
import { ProductsService } from '../products/products.service';

import { SearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(private readonly productService: ProductsService) {}

  async search(searchDto: SearchDto): Promise<Product[]> {
    const { query } = searchDto;

    return this.productService.findAll({
      where: { title: ILike(`%${query}%`) },
    });
  }
}
