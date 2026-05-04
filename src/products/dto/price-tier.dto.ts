// dto/price-tier.dto.ts

import { IsNumber, IsOptional, Min, Max } from "class-validator";

export class PriceTierDto {
  @IsNumber()
  @Min(1)
  min!: number;

  @IsOptional()
  @IsNumber()
  max?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount!: number; // 🔥 igual que tu UI
}
