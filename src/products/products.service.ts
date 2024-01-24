import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import * as sharp from 'sharp';

import { CreateProductDto } from './dto/create-product.dto';
import { FullProductDto } from './dto/full-product.dto';
import { PopulatedProductDto } from './dto/populated-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from './exceptions';
import { Product, ProductDocument } from './product.entity';

import { FilesBucketService } from '@/modules/aws';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly filesBucketService: FilesBucketService,
  ) {}

  async create(createProductDto: CreateProductDto, image: Buffer) {
    const { categories, price, discount, ...rest } = createProductDto;

    const formattedImage = await this.formatImage(image);

    const total: number = discount
      ? this.calculateTotalPrice(price, discount)
      : price;

    const product = new this.productModel({
      ...rest,
      discount,
      price,
      totalPrice: total,
      categories: categories,
    });

    const productId = product._id;

    const { imageName } = await this.saveImage(productId, formattedImage);

    product.imageName = imageName;

    const savedProduct = await product.save();

    const imageUrl = await this.getProductImageUrl(productId, imageName);

    savedProduct.imageUrl = imageUrl;

    return savedProduct;
  }

  async findAll(): Promise<PopulatedProductDto[]> {
    const products = await this.productModel
      .find()
      .populate<PopulatedProductDto>('categories', 'name slug')
      .lean()
      .exec();

    for (const product of products) {
      const imageUrl = await this.getProductImageUrl(
        product._id,
        product.imageName,
      );

      product.imageUrl = imageUrl;
    }

    return products;
  }

  async findOne(id: Types.ObjectId): Promise<PopulatedProductDto> {
    const product = await this.productModel
      .findOne({ _id: id })
      .populate<PopulatedProductDto>('categories', 'name slug')
      .lean()
      .exec();

    if (product === null) {
      throw new ProductNotFoundException(id);
    }

    const imageUrl = await this.getProductImageUrl(
      product._id,
      product.imageName,
    );

    product.imageUrl = imageUrl;

    return product;
  }

  async update(
    id: Types.ObjectId,
    updateProductDto: UpdateProductDto,
    image?: Buffer,
  ): Promise<PopulatedProductDto> {
    const product = await this.productModel
      .findById(id)
      .populate<PopulatedProductDto>('categories', 'name slug');

    if (product === null) {
      throw new ProductNotFoundException(id);
    }

    const { price, discount, categories, ...rest } = updateProductDto;

    const formattedImage = image ? await this.formatImage(image) : null;

    const formattedCategories = categories ? categories : [];

    const total =
      price && discount ? this.calculateTotalPrice(price, discount) : price;

    const oldImageName = product.imageName;

    if (formattedImage) {
      const { imageName } = await this.saveImage(
        product._id,
        formattedImage,
        oldImageName,
      );

      const newImageUrl = await this.getProductImageUrl(product._id, imageName);

      product.imageUrl = newImageUrl;
    }

    product
      .updateOne(
        {
          ...rest,
          price,
          totalPrice: total,
          categories: formattedCategories,
          discount,
        },
        { new: true },
      )
      .exec();

    return product;
  }

  async remove(id: Types.ObjectId): Promise<Product> {
    const toBeDeletedProduct = await this.productModel.findById(id).exec();

    if (toBeDeletedProduct === null) {
      throw new ProductNotFoundException(id);
    }

    await this.deleteProductImages(id);

    await toBeDeletedProduct.deleteOne();

    return toBeDeletedProduct;
  }

  async assignImageURLToProducts(
    products: FullProductDto[],
  ): Promise<FullProductDto[]> {
    for (const product of products) {
      const imageUrl = await this.getProductImageUrl(
        product._id,
        product.imageName,
      );

      product.imageUrl = imageUrl;
    }

    return products;
  }

  private async saveImage(
    productId: Types.ObjectId,
    image: Buffer,
    oldImageName?: string,
  ) {
    let imageName: string | null = null;

    if (oldImageName) {
      imageName = oldImageName;
    } else {
      imageName = this.randomImageName();
    }

    await this.filesBucketService.put({
      Key: `${productId}/${imageName}`,
      Body: image,
    });

    return { imageName };
  }

  private deleteProductImages(productId: Types.ObjectId) {
    return this.filesBucketService.deleteMultiple({
      Prefix: `${productId}`,
    });
  }

  private getProductImageUrl(
    id: Types.ObjectId,
    name: string,
  ): Promise<string> {
    return this.filesBucketService.getSignedUrl({
      Key: `${id}/${name}`,
    });
  }

  private calculateTotalPrice(price: number, discount: number): number {
    return Number((price - price * (discount / 100)).toFixed(1));
  }

  private randomImageName(bytes: number = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  private async formatImage(image: Buffer): Promise<Buffer> {
    return await sharp(image).jpeg().resize(600, 600).toBuffer();
  }
}
