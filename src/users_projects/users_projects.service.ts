import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project } from "./user_projects.schema";

@Injectable()
export class UsersProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  async create(data: { imageUrl: string; userId: string }) {
    return await this.projectModel.create({
      imageUrl: data.imageUrl,
      userId: data.userId,
    });
  }

  async findById(id: string) {
    return this.projectModel.findById(id);
  }
}
