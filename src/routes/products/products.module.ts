import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductCategoriesModule } from '../product-categories/product-categories.module';

import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { FilesModule } from '@/modules/files';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductCategoriesModule,
    FilesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
