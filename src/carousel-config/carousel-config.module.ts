import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarouselConfigController } from './carousel-config.controller';
import { CarouselConfigService } from './carousel-config.service';
import { CarouselConfig, CarouselConfigSchema } from './schemas/carousel-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CarouselConfig.name, schema: CarouselConfigSchema },
    ]),
  ],
  controllers: [CarouselConfigController],
  providers: [CarouselConfigService],
  exports: [CarouselConfigService],
})
export class CarouselConfigModule {}
