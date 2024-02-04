import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryNotFoundException } from './exceptions';
import {
  ProductCategory,
  ProductCategoryDocument,
} from './product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectModel(ProductCategory.name)
    private readonly productCategoryModel: Model<ProductCategoryDocument>,
  ) {}

  async create(createProductCategory: CreateProductCategoryDto) {
    const newCategory = new this.productCategoryModel(createProductCategory);
    return newCategory.save();
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.productCategoryModel.find().exec();
  }

  async findOne(id: string): Promise<ProductCategory> {
    const productCategory = await this.productCategoryModel
      .findOne({ _id: id })
      .exec();

    if (productCategory === null) {
      throw new ProductCategoryNotFoundException(id);
    }

    return productCategory;
  }

  async update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    try {
      const productCategory = await this.productCategoryModel
        .findOneAndUpdate({ _id: id }, updateProductCategoryDto, { new: true })
        .exec();

      if (productCategory === null) {
        throw new ProductCategoryNotFoundException(id);
      }

      return productCategory;
    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(id: string) {
    const productCategory = await this.productCategoryModel
      .findByIdAndDelete({ _id: id })
      .exec();

    if (productCategory === null) {
      throw new ProductCategoryNotFoundException(id);
    }

    return productCategory;
  }
}
