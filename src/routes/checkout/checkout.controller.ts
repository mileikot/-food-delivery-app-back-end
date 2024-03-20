import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { UserAuthGuard } from '../auth/guards';

import { CheckoutCalculationDto } from './dto/checkout-calculation.dto';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
@UseGuards(UserAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('calculate')
  calculate(
    @Query()
    checkoutCalculationDto: CheckoutCalculationDto,
  ) {
    return this.checkoutService.calculate(checkoutCalculationDto);
  }
}
