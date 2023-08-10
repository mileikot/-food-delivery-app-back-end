import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoriesService } from './product-categories.service';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    try {
      return await this.productCategoriesService.create(
        createProductCategoryDto,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.productCategoriesService.findAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productCategoriesService.findOne(id);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    try {
      return await this.productCategoriesService.update(
        id,
        updateProductCategoryDto,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productCategoriesService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }
}
