import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// Sub-schema para Description
@Schema()
export class Description {
  @Prop({ type: String })
  general: string;

  @Prop({ type: [String] })
  highlights: string[];

  @Prop({ type: String })
  installation: string;

  @Prop({ type: [String] })
  installationSteps: string[];

  @Prop({ type: String })
  overview: string;

  @Prop({ type: String })
  purchaseInstructions: string;
}

export const DescriptionSchema = SchemaFactory.createForClass(Description);

// Sub-schema para Price
@Schema()
export class Price {
  @Prop({ type: Number })
  original: number;

  @Prop({ type: Number })
  current: number;

  @Prop({ type: String })
  currency: string;
}

export const PriceSchema = SchemaFactory.createForClass(Price);

// Sub-schema para Reviews
@Schema()
export class Reviews {
  @Prop({ type: Number })
  rating: number;

  @Prop({ type: Number })
  count: number;
}

export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
