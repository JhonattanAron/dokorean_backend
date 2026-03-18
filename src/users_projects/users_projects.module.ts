import { Module } from "@nestjs/common";
import { UsersProjectsService } from "./users_projects.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "./user_projects.schema";
import { UsersProjectsController } from "./users_projects.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  providers: [UsersProjectsService],
  controllers: [UsersProjectsController],
})
export class UsersProjectsModule {}
