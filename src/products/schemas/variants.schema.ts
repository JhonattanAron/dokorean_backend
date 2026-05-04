import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// product.schema.ts

@Schema({ _id: false })
export class PricingTier {
  @Prop({ required: true })
  min!: number;

  @Prop()
  max?: number;

  @Prop({ required: true, min: 0, max: 100 })
  discount!: number; // 🔥 igual que tu frontend
}

@Schema({ _id: false })
export class Variant {
  @Prop({ required: true })
  name!: string;

  @Prop()
  sku?: string;

  @Prop()
  image?: string;

  @Prop({ type: Object, default: {} })
  specs!: Record<string, any>; // 🔥 dinámico

  @Prop({ type: Object, default: {} })
  attributes!: Record<string, any>; // 🔥 peso, stock, etc dinámico

  @Prop({ type: [PricingTier], default: [] })
  pricing!: PricingTier[];
}
