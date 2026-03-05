import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  Description,
  DescriptionSchema,
  Price,
  PriceSchema,
  Reviews,
  ReviewsSchema,
} from "./sub.schema";

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: String })
  brand: string;

  @Prop({ type: [String] })
  category: string[];

  @Prop({ type: [String] })
  claims: string[];

  @Prop({ type: String })
  contentSize: string;

  @Prop({ type: String })
  deliveryTime: string;

  @Prop({ type: Description, required: false })
  description?: Description;

  @Prop({ type: Object, required: false })
  dimensions?: Record<string, any>; // si quieres más detalle, puedes definir sub-schema también

  @Prop({ type: [String] })
  features: string[];

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Boolean })
  inStock: boolean;

  @Prop({ type: String })
  mainImage: string;

  @Prop({ type: Price, required: false })
  price?: Price;

  @Prop({ type: Number })
  price_per_m2: number;

  @Prop({ type: Reviews, required: false })
  reviews?: Reviews;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Number, required: false })
  stock?: number;

  @Prop({ type: String })
  title: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
