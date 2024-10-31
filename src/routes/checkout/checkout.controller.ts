import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { UserAuthGuard } from '../auth/guards';

import { CheckoutCalculationDto } from './dto/checkout-calculation.dto';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
@UseGuards(UserAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('calculate')
  calculate(
    @Body()
    checkoutCalculationDto: CheckoutCalculationDto,
  ) {
    return this.checkoutService.calculate(checkoutCalculationDto);
  }
}
