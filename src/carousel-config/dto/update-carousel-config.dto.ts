import { IsString, IsOptional, IsArray } from "class-validator";

export class UpdateCarouselConfigDto {
  @IsOptional()
  @IsString()
  headerImage?: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  extraImages?: string[];
}
