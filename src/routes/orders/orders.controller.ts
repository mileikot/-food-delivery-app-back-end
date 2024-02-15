import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { RequestWithUser } from '../../types/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Req() request: RequestWithUser,
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.create(createOrderDto, request.user);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get('/my')
  async findAllByOwnerId(@Req() request: RequestWithUser) {
    return await this.ordersService.findAllByOwnerId(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
