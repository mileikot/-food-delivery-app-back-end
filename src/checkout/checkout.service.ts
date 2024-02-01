import { Injectable } from '@nestjs/common';

import { CheckoutCalculationDto } from './dto/checkout-calculation.dto';

import { ProductsService } from '@/products/products.service';

@Injectable()
export class CheckoutService {
  constructor(private readonly productsService: ProductsService) {}

  async calculate(checkoutCalculationDto: CheckoutCalculationDto) {
    const { products } = checkoutCalculationDto;

    const productIds = products.map((product) => product.id);

    const quantityMap = products.reduce<Record<string, number>>(
      (acc, product) => {
        acc[product.id] = product.quantity;

        return acc;
      },
      {},
    );

    const checkoutProducts = await this.productsService.findAll({
      _id: {
        $in: productIds,
      },
    });

    const totalPrice = checkoutProducts.reduce(
      (acc, product) =>
        (acc += product.totalPrice * quantityMap[product._id.toString()]),
      0,
    );

    const checkoutContent = checkoutProducts.map((product) => ({
      product,
      quantity: quantityMap[product._id.toString()],
    }));

    return {
      content: checkoutContent,
      totalPrice,
    };
  }
}
