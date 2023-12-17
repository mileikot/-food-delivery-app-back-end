import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MAX_IMAGE_SIZE } from './constants';
import { ProductsService } from './products.service';

import { TransformFormDataPipe } from '@/pipes';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MAX_IMAGE_SIZE,
            message: `Image's size is too big!`,
          }),
          new FileTypeValidator({ fileType: /image\/(jpe?g)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
    @Body(new TransformFormDataPipe()) createProductDto: CreateProductDto,
  ) {
    try {
      return await this.productsService.create(createProductDto, image.buffer);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId) {
    try {
      return await this.productsService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: Types.ObjectId,
    @UploadedFile() image: Express.Multer.File,
    @Body(new TransformFormDataPipe())
    updateProductDto: UpdateProductDto,
  ) {
    try {
      return await this.productsService.update(
        id,
        updateProductDto,
        image?.buffer,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: Types.ObjectId) {
    try {
      await this.productsService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
