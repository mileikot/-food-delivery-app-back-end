import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CheckoutCalculationDto } from './dto/checkout-calculation.dto';

import { PopulatedProductDto } from '@/products/dto/populated-product.dto';
import { Product, ProductDocument } from '@/products/product.entity';
import { ProductsService } from '@/products/products.service';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly productsService: ProductsService,
  ) {}

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

    const checkoutProducts = await this.productModel
      .find({
        _id: {
          $in: productIds,
        },
      })
      .populate<PopulatedProductDto>('categories', 'name slug')
      .lean()
      .exec();

    const fullCheckoutProducts =
      await this.productsService.assignImageURLToProducts(checkoutProducts);

    const totalPrice = fullCheckoutProducts.reduce(
      (acc, product) =>
        (acc += product.totalPrice * quantityMap[product._id.toString()]),
      0,
    );

    const checkoutContent = fullCheckoutProducts.map((product) => ({
      product,
      quantity: quantityMap[product._id.toString()],
    }));

    return {
      content: checkoutContent,
      totalPrice,
    };
  }
}
