/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'products', timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  externalId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Array, default: [] })
  images: string[];

  @Prop()
  mainImage: string;

  @Prop()
  specifications: string;

  @Prop()
  sourceUrl: string;

  @Prop()
  videoUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
