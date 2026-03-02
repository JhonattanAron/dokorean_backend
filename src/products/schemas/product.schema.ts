import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  externalId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  price: string;

  @Prop()
  pricePerM2: string;

  @Prop()
  contentSize: string;

  @Prop()
  deliveryTime: string;

  @Prop()
  stock: string;

  @Prop()
  productNumber: string;

  @Prop()
  sourceUrl: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  mainImage: string;

  @Prop({ type: [String], default: [] })
  categories: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
