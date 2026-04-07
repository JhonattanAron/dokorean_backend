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
      userId: data.userId,
      versions: [
        {
          version: 1,
          imageUrl: data.imageUrl,
        },
      ],
      currentVersion: 1,
    });
  }

  async addVersion(
    projectId: string,
    data: {
      imageUrl: string;
      prompt: string;
      referenceImages: any[];
    },
  ) {
    const project = await this.projectModel.findById(projectId);

    if (!project) throw new Error("Proyecto no encontrado");

    const newVersionNumber = project.versions.length + 1;

    project.versions.push({
      version: newVersionNumber,
      imageUrl: data.imageUrl,
      prompt: data.prompt,
      referenceImages: data.referenceImages,
      createdAt: new Date(),
    });

    project.currentVersion = newVersionNumber;

    await project.save();

    return project;
  }

  async findById(id: string) {
    return this.projectModel.findById(id);
  }
  async setCurrentVersion(projectId: string, version: number) {
    return this.projectModel.findByIdAndUpdate(
      projectId,
      { currentVersion: version },
      { new: true },
    );
  }
  async getCurrentImage(projectId: string) {
    const project = await this.projectModel.findById(projectId);

    if (!project) throw new Error("Proyecto no encontrado");

    const current = project.versions.find(
      (v) => v.version === project.currentVersion,
    );

    return current?.imageUrl;
  }
}
