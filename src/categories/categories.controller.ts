import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create({
        ...createCategoryDto,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.categoriesService.findAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.categoriesService.findOne(id);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateCategoryDto,
  ) {
    try {
      return await this.categoriesService.update(id, updateProductDto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.categoriesService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }
}
