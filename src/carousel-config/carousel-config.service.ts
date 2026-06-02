import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CarouselConfig } from './schemas/carousel-config.schema';
import { UpdateCarouselConfigDto } from './dto/update-carousel-config.dto';

@Injectable()
export class CarouselConfigService {
  constructor(
    @InjectModel(CarouselConfig.name)
    private readonly carouselConfigModel: Model<CarouselConfig>,
  ) {}

  async findAll() {
    const configs = await this.carouselConfigModel.find().exec();
    // Transform to an object grouped by section for easier frontend consumption
    return configs.reduce((acc, config) => {
      acc[config.section] = config;
      return acc;
    }, {} as Record<string, CarouselConfig>);
  }

  async update(section: string, updateDto: UpdateCarouselConfigDto) {
    return this.carouselConfigModel
      .findOneAndUpdate({ section }, updateDto, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .exec();
  }

  async updateBulk(configs: Record<string, UpdateCarouselConfigDto>) {
    const operations = Object.entries(configs).map(([section, updateDto]) => ({
      updateOne: {
        filter: { section },
        update: { $set: updateDto },
        upsert: true,
      },
    }));
    return this.carouselConfigModel.bulkWrite(operations);
  }
}
