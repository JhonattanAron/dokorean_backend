/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  externalId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;
}
