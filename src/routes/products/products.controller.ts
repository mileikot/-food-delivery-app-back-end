import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ManagerAuthGuard } from '../auth/guards';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { maxFileSizeValidator } from './validation';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(ManagerAuthGuard)
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [maxFileSizeValidator],
      }),
    )
    image: Express.Multer.File,
    @Body()
    createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, image.buffer);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOneById(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(ManagerAuthGuard)
  update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [maxFileSizeValidator],
        fileIsRequired: false,
      }),
    )
    image: Express.Multer.File,
    @Body()
    updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto, image?.buffer);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
