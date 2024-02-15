import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Body(new TransformFormDataPipe(), new ValidationPipe())
    createProductDto: CreateProductDto,
  ) {
    return await this.productsService.create(createProductDto, image.buffer);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body(new TransformFormDataPipe())
    updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(
      +id,
      updateProductDto,
      image?.buffer,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
