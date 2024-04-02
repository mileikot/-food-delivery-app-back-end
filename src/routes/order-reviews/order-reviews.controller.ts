import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ManagerAuthGuard, UserAuthGuard } from '../auth/guards';

import { CreateOrderReviewDto } from './dto/create-order-review.dto';
import { UpdateOrderReviewDto } from './dto/update-order-review.dto';
import { OrderReviewsService } from './order-reviews.service';

@Controller('order-reviews')
export class OrderReviewsController {
  constructor(private readonly orderReviewsService: OrderReviewsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(@Body() createOrderReviewDto: CreateOrderReviewDto) {
    return this.orderReviewsService.create(createOrderReviewDto);
  }

  @Get()
  @UseGuards(ManagerAuthGuard)
  findAll() {
    return this.orderReviewsService.findAll();
  }

  @Get(':id')
  @UseGuards(ManagerAuthGuard)
  findOne(@Param('id') id: number) {
    return this.orderReviewsService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(ManagerAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateOrderReviewDto: UpdateOrderReviewDto,
  ) {
    return this.orderReviewsService.update(id, updateOrderReviewDto);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  remove(@Param('id') id: number) {
    return this.orderReviewsService.remove(id);
  }
}
