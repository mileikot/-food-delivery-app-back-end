import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { CheckoutCalculationDto } from './dto/checkout-calculation.dto';

import { ProductsService } from '@/routes/products/products.service';

@Injectable()
export class CheckoutService {
  constructor(private readonly productsService: ProductsService) {}

  async calculate(checkoutCalculationDto: CheckoutCalculationDto) {
    const { products } = checkoutCalculationDto;

    const productIds = products.map((product) => product.id);

    const quantityMap = products.reduce<Record<string, number>>(
      (acc, product) => {
        acc[product.id.toString()] = product.quantity;

        return acc;
      },
      {},
    );

    const checkoutProducts = await this.productsService.findAll({
      where: { id: In(productIds) },
    });

    const totalPrice = checkoutProducts.reduce(
      (acc, product) => (acc += product.totalPrice * quantityMap[product.id]),
      0,
    );

    const checkoutContent = checkoutProducts.map((product) => ({
      product,
      quantity: quantityMap[product.id],
    }));

    return {
      content: checkoutContent,
      totalPrice,
    };
  }
}
