// dto/variant.dto.ts

import {
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { PriceTierDto } from "./price-tier.dto";

export class VariantDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsObject()
  specs!: Record<string, any>; // 🔥 dinámico

  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>; // 🔥 dinámico

  // 🔥 MEJORADO (no lo dejes en attributes)
  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsString()
  packaging?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceTierDto)
  pricing!: PriceTierDto[];
}
