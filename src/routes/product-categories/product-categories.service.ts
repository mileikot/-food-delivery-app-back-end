import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import {
  ProductCategoryAlreadyExistsException,
  ProductCategoryNotFoundException,
} from './exceptions';
import { ProductCategory } from './product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const { name } = createProductCategoryDto;

    const slug = this.createCategorySlug(name);

    const existingCategory = await this.productCategoryRepository.findOne({
      where: { slug },
    });

    if (existingCategory) {
      throw new ProductCategoryAlreadyExistsException();
    }

    const newCategory = this.productCategoryRepository.create({
      name: name.trim(),
      slug,
    });

    const savedCategory =
      await this.productCategoryRepository.save(newCategory);

    return savedCategory;
  }

  async findAll(
    options?: FindManyOptions<ProductCategory>,
  ): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<ProductCategory>,
  ): Promise<ProductCategory> {
    const productCategory =
      await this.productCategoryRepository.findOne(options);

    if (!productCategory) {
      throw new ProductCategoryNotFoundException();
    }

    return productCategory;
  }

  findOneById(id: number): Promise<ProductCategory> {
    return this.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const productCategory = await this.findOneById(id);

    const { name } = updateProductCategoryDto;

    const slug = this.createCategorySlug(name);

    const mergedCategory = this.productCategoryRepository.merge(
      productCategory,
      {
        name: name.trim(),
        slug,
      },
    );

    const updatedCategory =
      await this.productCategoryRepository.save(mergedCategory);

    return updatedCategory;
  }

  async remove(id: number): Promise<ProductCategory> {
    const productCategory = await this.findOneById(id);

    const removedProductCategory =
      await this.productCategoryRepository.remove(productCategory);

    return removedProductCategory;
  }

  createCategorySlug(name: string) {
    return name
      .trim()
      .split(' ')
      .map((part) => part.toLowerCase())
      .join('-');
  }
}
