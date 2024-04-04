import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as sharp from 'sharp';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';

import { ProductCategoriesService } from '../product-categories/product-categories.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from './exceptions';
import { Product } from './product.entity';

import { FilesService } from '@/modules/files';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productCategoryService: ProductCategoriesService,
    private readonly filesService: FilesService,
  ) {}

  async create(createProductDto: CreateProductDto, image: Buffer) {
    const { categories, price, discount, ...rest } = createProductDto;

    const total: number = discount
      ? this.calculateTotalPrice(price, discount)
      : price;

    const dbCategories = await this.getCategoriesByIds(categories);

    const newProduct = this.productRepository.create({
      ...rest,
      discount,
      price,
      totalPrice: total,
      categories: dbCategories,
    });

    const product = await this.productRepository.save(newProduct);

    const productId = product.id;

    const { fileName, fileURL } = await this.filesService.saveFile(
      productId,
      image,
    );

    product.imageName = fileName;
    product.imageUrl = fileURL;

    const savedProduct = this.productRepository.save(product);

    return savedProduct;
  }

  async findAll(options?: FindManyOptions<Product>): Promise<Product[]> {
    const products = await this.productRepository.find({
      ...options,
      relations: {
        categories: true,
        ...options?.relations,
      },
    });

    const updatedProducts = await this.assignImageURLToProducts(products);

    return updatedProducts;
  }

  async findOne(options: FindOneOptions<Product>): Promise<Product> {
    const product = await this.productRepository.findOne({
      ...options,
      relations: {
        categories: true,
        ...options?.relations,
      },
    });

    if (product === null) {
      throw new ProductNotFoundException();
    }

    const imageUrl = await this.filesService.getFileURL(
      product.id,
      product.imageName,
    );

    product.imageUrl = imageUrl;

    return product;
  }

  findOneById(id: number): Promise<Product> {
    return this.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    image?: Buffer,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        categories: true,
      },
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    const { price, discount, categories, ...rest } = updateProductDto;

    if (categories) {
      const dbCategories = await this.getCategoriesByIds(categories);

      product.categories = dbCategories;
    }

    if (image) {
      const formattedImage = await this.formatImage(image);

      const { fileName, fileURL } = await this.filesService.saveFile(
        product.id,
        formattedImage,
        product.imageName,
      );

      product.imageUrl = fileName;
      product.imageUrl = fileURL;
    } else {
      const fileURL = await this.filesService.getFileURL(
        product.id,
        product.imageName,
      );

      product.imageUrl = fileURL;
    }

    const totalPrice =
      price && discount ? this.calculateTotalPrice(price, discount) : price;

    const toBeUpdatedProduct = this.productRepository.merge(product, {
      ...rest,
      price,
      discount,
      totalPrice,
    });

    const updatedProduct =
      await this.productRepository.save(toBeUpdatedProduct);

    return updatedProduct;
  }

  async remove(id: number): Promise<Product> {
    const toBeDeletedProduct = await this.productRepository.findOneBy({ id });

    if (toBeDeletedProduct === null) {
      throw new ProductNotFoundException();
    }

    await this.filesService.deleteFiles(id);

    const deletedProduct =
      await this.productRepository.remove(toBeDeletedProduct);

    return {
      ...deletedProduct,
      imageName: null,
      imageUrl: '',
    };
  }

  private async assignImageURLToProducts(
    products: Product[],
  ): Promise<Product[]> {
    for (const product of products) {
      const imageUrl = await this.filesService.getFileURL(
        product.id,
        product.imageName,
      );

      product.imageUrl = imageUrl;
    }

    return products;
  }

  private async formatImage(file: Buffer): Promise<Buffer> {
    return sharp(file).jpeg().resize(600, 600).toBuffer();
  }

  private async getCategoriesByIds(categories: number[]) {
    return this.productCategoryService.findAll({
      where: { id: In(categories) },
    });
  }

  private calculateTotalPrice(price: number, discount: number): number {
    return Number((price - price * (discount / 100)).toFixed(1));
  }
}
