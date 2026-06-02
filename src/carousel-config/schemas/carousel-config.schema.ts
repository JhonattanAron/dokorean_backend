import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class CarouselConfig extends Document {
  @Prop({ type: String, required: true, unique: true })
  section!: string; // "homeHero", "paneles", "cocina", "plantas", "personalizacion", "ambientes"

  @Prop({ type: String })
  headerImage?: string;

  @Prop({ type: String })
  backgroundImage?: string;

  @Prop({ type: [String], default: [] })
  extraImages!: string[];

  @Prop({ type: Date })
  updatedAt!: Date;
}

export const CarouselConfigSchema = SchemaFactory.createForClass(CarouselConfig);
