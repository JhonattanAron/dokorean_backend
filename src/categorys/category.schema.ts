import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  // icono para el sidebar
  @Prop({
    required: true,
  })
  icon: string;

  @Prop({
    type: Types.ObjectId,
    ref: "Category",
    default: null,
  })
  parent: Types.ObjectId | null;

  @Prop({
    default: 0,
  })
  level: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
