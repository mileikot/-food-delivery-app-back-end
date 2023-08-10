import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from './exceptions';
import { Product, ProductDocument } from './product.entity';
import { PopulatedProduct } from './types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { image, categories, price, discount, ...rest } = createProductDto;

    const formattedImage = await this.formatImage(image);

    const total: number = discount
      ? this.calculateTotal(price, discount)
      : price;

    const createProduct = new this.productModel({
      ...rest,
      discount,
      price,
      totalPrice: total,
      image: formattedImage,
      categories: JSON.parse(categories),
    });

    return createProduct.save();
  }

  async findAll(): Promise<PopulatedProduct[]> {
    const products = await this.productModel
      .find()
      .populate<PopulatedProduct>('categories', 'name slug')
      .exec();

    return products;
  }

  async findOne(id: string): Promise<PopulatedProduct> {
    const product = await this.productModel
      .findOne({ _id: id })
      .populate<PopulatedProduct>('categories', 'name slug')
      .exec();

    if (product === null) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<PopulatedProduct> {
    const { price, discount, image, categories, ...rest } = updateProductDto;

    const formattedImage = image ? await this.formatImage(image) : undefined;

    const formattedCategories = categories ? JSON.parse(categories) : [];

    const total =
      price && discount ? this.calculateTotal(price, discount) : price;

    const updatedProduct = await this.productModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...rest,
            price,
            totalPrice: total,
            image: formattedImage,
            categories: formattedCategories,
            discount: Number(discount) === 0 ? null : discount,
          },
        },
        { new: true },
      )
      .populate<PopulatedProduct>('categories', 'name slug')
      .exec();

    if (updatedProduct === null) {
      throw new ProductNotFoundException(id);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel
      .findByIdAndRemove({ _id: id })
      .exec();

    if (deletedProduct === null) {
      throw new ProductNotFoundException(id);
    }

    return deletedProduct;
  }

  async getProductImage(id: string): Promise<Buffer> {
    const product = await this.productModel.findOne({ _id: id }).exec();

    if (product === null) {
      throw new ProductNotFoundException(id);
    }

    return product.image;
  }

  calculateTotal(price: number, discount: number): number {
    return Number((price - price * (discount / 100)).toFixed(1));
  }

  async formatImage(image: Buffer): Promise<Buffer> {
    return await sharp(image).jpeg().resize(600, 600).toBuffer();
  }
}
