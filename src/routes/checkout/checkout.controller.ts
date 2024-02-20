import { Controller, Get, Query } from '@nestjs/common';

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
    return await this.checkoutService.calculate(checkoutCalculationDto);
  }
}
