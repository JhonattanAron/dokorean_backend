// project.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

class ProjectVersion {
  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  prompt: string;

  @Prop({ type: Array, default: [] })
  referenceImages: any[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema()
export class Project extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: "Mi proyecto" })
  name: string;

  @Prop({ type: [ProjectVersion], default: [] })
  versions: ProjectVersion[];

  @Prop({ default: 1 })
  currentVersion: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
