import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { UsersProjectsService } from "./users_projects.service";

@Controller("users-projects")
export class UsersProjectsController {
  constructor(private readonly projectsService: UsersProjectsService) {}

  @Post()
  async createProject(@Body() body: { imageUrl: string }, @Req() req: any) {
    const project = await this.projectsService.create({
      imageUrl: body.imageUrl,
      userId: req.user?.id || "anon",
    });

    return project;
  }
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.projectsService.findById(id);
  }
}
