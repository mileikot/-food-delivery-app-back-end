import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ManagerAuthGuard, UserAuthGuard } from '../auth/guards';

import { CreateOrderReviewDto } from './dto/create-order-review.dto';
import { UpdateOrderReviewDto } from './dto/update-order-review.dto';
import { OrderReviewsService } from './order-reviews.service';

import { RequestWithUser } from '@/types';

@Controller('order-reviews')
export class OrderReviewsController {
  constructor(private readonly orderReviewsService: OrderReviewsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  create(
    @Body() createOrderReviewDto: CreateOrderReviewDto,
    @Req() request: RequestWithUser,
  ) {
    return this.orderReviewsService.create(
      createOrderReviewDto,
      request.userId,
    );
  }

  @Get()
  @UseGuards(ManagerAuthGuard)
  findAll() {
    return this.orderReviewsService.findAll();
  }

  @Get(':id')
  @UseGuards(ManagerAuthGuard)
  findOne(@Param('id') id: string) {
    return this.orderReviewsService.findOneById(+id);
  }

  @Patch(':id')
  @UseGuards(ManagerAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrderReviewDto: UpdateOrderReviewDto,
  ) {
    return this.orderReviewsService.update(+id, updateOrderReviewDto);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  remove(@Param('id') id: string) {
    return this.orderReviewsService.remove(+id);
  }
}
