import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ManagerAuthGuard, UserAuthGuard } from '../auth/guards';

import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReviewsService } from './product-reviews.service';

import { RequestWithUser } from '@/types';

@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private readonly productReviewsService: ProductReviewsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(
    @Body() createOrderReviewDto: CreateProductReviewDto,
    @Req() request: RequestWithUser,
  ) {
    return this.productReviewsService.create(
      createOrderReviewDto,
      request.userId,
    );
  }

  @Get()
  @UseGuards(ManagerAuthGuard)
  findAll(@Query('productId') productId: string) {
    if (productId) {
      return this.productReviewsService.findAllByProductId(+productId);
    }

    return this.productReviewsService.findAll();
  }

  @Get(':id')
  @UseGuards(ManagerAuthGuard)
  findOne(@Param('id') id: number) {
    return this.productReviewsService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(ManagerAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateOrderReviewDto: UpdateProductReviewDto,
  ) {
    return this.productReviewsService.update(id, updateOrderReviewDto);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  remove(@Param('id') id: number) {
    return this.productReviewsService.remove(id);
  }
}
