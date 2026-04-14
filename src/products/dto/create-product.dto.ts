import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class DescriptionDto {
  @IsString()
  general!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @IsString()
  installation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  installationSteps?: string[];

  @IsOptional()
  @IsString()
  overview?: string;

  @IsOptional()
  @IsString()
  purchaseInstructions?: string;
}

class PriceDto {
  @IsNumber()
  original!: number;

  @IsNumber()
  current!: number;

  @IsString()
  currency!: string;
}

class ReviewsDto {
  @IsNumber()
  rating!: number;

  @IsNumber()
  count!: number;
}

class BundleTierDto {
  quantity!: number;
  discountPercent!: number;
}

export class CreateProductDto {
  @IsString()
  brand!: string;

  @IsArray()
  @IsString({ each: true })
  category!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  claims?: string[];

  @IsOptional()
  @IsString()
  contentSize?: string;

  @IsOptional()
  @IsString()
  deliveryTime?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DescriptionDto)
  description?: DescriptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BundleTierDto)
  packs?: BundleTierDto[];

  @IsOptional()
  dimensions?: Record<string, any>; // sub-schema opcional si no tenemos detalle

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  price?: PriceDto;

  @IsNumber()
  price_per_m2!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReviewsDto)
  reviews?: ReviewsDto;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsString()
  title!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @IsOptional()
  @IsString()
  mainVideo?: string;
}
