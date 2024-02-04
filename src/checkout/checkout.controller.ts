import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { CheckoutCalculationDto } from './dto/checkout-calculation.dto';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('calculate')
  async calculate(
    @Query()
    checkoutCalculationDto: CheckoutCalculationDto,
  ) {
    try {
      return await this.checkoutService.calculate(checkoutCalculationDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
