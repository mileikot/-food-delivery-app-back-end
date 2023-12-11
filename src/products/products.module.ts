import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { FilesBucketModule, FilesBucketService } from '@/modules/aws';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FilesBucketModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FilesBucketService],
})
export class ProductsModule {}
