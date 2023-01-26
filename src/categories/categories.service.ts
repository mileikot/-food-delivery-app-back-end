import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/db/schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryNotFoundException } from './exceptions';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ _id: id }).exec();

    if (category === null) {
      throw new CategoryNotFoundException(id);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.categoryModel
        .findOneAndUpdate({ _id: id }, updateCategoryDto, { new: true })
        .exec();

      if (category === null) {
        throw new CategoryNotFoundException(id);
      }

      return category;
    } catch (e) {
      throw new Error(e);
    }
  }

  async remove(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndRemove({ _id: id })
      .exec();

    if (category === null) {
      throw new CategoryNotFoundException(id);
    }

    return category;
  }
}
