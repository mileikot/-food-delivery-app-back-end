import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategoryNotFoundException } from './exceptions';
import { ProductCategory } from './product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const newCategory = await this.productCategoryRepository.save(
      createProductCategoryDto,
    );

    return newCategory;
  }

  async findAll(
    options?: FindManyOptions<ProductCategory>,
  ): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find(options);
  }

  async findOne(id: number): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id },
    });

    if (productCategory === null) {
      throw new ProductCategoryNotFoundException(id);
    }

    return productCategory;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOneBy({
      id,
    });

    if (productCategory === null) {
      throw new ProductCategoryNotFoundException(id);
    }

    const toBeUpdatedCategory = this.productCategoryRepository.merge(
      productCategory,
      updateProductCategoryDto,
    );

    const updatedCategory =
      await this.productCategoryRepository.save(toBeUpdatedCategory);

    return updatedCategory;
  }

  async remove(id: number): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOneBy({
      id,
    });

    if (productCategory === null) {
      throw new ProductCategoryNotFoundException(id);
    }

    const removedProductCategory =
      await this.productCategoryRepository.remove(productCategory);

    return {
      ...removedProductCategory,
      id,
    };
  }
}
