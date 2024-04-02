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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { RequestWithUser } from '../../types/common';
import { ManagerAuthGuard, UserAuthGuard } from '../auth/guards';
import { AuthGuard } from '../auth/guards/auth.guard';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(UserAuthGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, request.userId);
  }

  @Get()
  @UseGuards(ManagerAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('/my')
  @UseGuards(UserAuthGuard)
  findAllByOwnerId(@Req() request: RequestWithUser) {
    return this.ordersService.findAllByOwnerId(request.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.ordersService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(ManagerAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(ManagerAuthGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
