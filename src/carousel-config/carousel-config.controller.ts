import { Controller, Get, Put, Post, Body, Param } from '@nestjs/common';
import { CarouselConfigService } from './carousel-config.service';
import { UpdateCarouselConfigDto } from './dto/update-carousel-config.dto';

@Controller('carousel-config')
export class CarouselConfigController {
  constructor(private readonly carouselConfigService: CarouselConfigService) {}

  @Get()
  findAll() {
    return this.carouselConfigService.findAll();
  }

  @Put(':section')
  update(
    @Param('section') section: string,
    @Body() updateDto: UpdateCarouselConfigDto,
  ) {
    return this.carouselConfigService.update(section, updateDto);
  }

  @Post('bulk')
  updateBulk(@Body() configs: Record<string, UpdateCarouselConfigDto>) {
    return this.carouselConfigService.updateBulk(configs);
  }
}
