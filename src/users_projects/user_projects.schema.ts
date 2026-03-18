// project.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: "Mi proyecto" })
  name: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
