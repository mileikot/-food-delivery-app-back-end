import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import { Product, ProductDocument } from '../db/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from './exceptions';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { image, ...rest } = createProductDto;

    const formatedImage = await sharp(image).jpeg().resize(600, 600).toBuffer();

    const createProduct = new this.productModel({
      ...rest,
      totalPrice: createProductDto.price,
      image: formatedImage,
    });

    return createProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findOne({ _id: id }).exec();

    if (product === null) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findOneAndUpdate({ _id: id }, updateProductDto, { new: true })
        .exec();

      if (updatedProduct === null) {
        throw new ProductNotFoundException(id);
      }

      return updatedProduct;
    } catch (e) {
      throw new Error(e);
    }
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

  async getProductImage(id: string) {
    const product = await this.productModel.findOne({ _id: id }).exec();

    if (product === null) {
      throw new ProductNotFoundException(id);
    }

    return product.image;
  }
}
