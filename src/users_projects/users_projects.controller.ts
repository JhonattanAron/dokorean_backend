import { Controller, Post, Get, Patch, Param, Body } from "@nestjs/common";
import { UsersProjectsService } from "./users_projects.service";

@Controller("projects")
export class UsersProjectsController {
  constructor(private readonly projectsService: UsersProjectsService) {}

  // 🔥 Crear proyecto (v1 automática)
  @Post()
  async createProject(@Body() body: { imageUrl: string; userId: string }) {
    try {
      const project = await this.projectsService.create(body);

      return {
        success: true,
        data: project,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // 🔥 Agregar nueva versión (IA)
  @Post(":projectId/versions")
  async addVersion(
    @Param("projectId") projectId: string,
    @Body()
    body: {
      imageUrl: string;
      prompt: string;
      referenceImages: any[];
    },
  ) {
    try {
      const project = await this.projectsService.addVersion(projectId, body);

      return {
        success: true,
        data: project,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // 🔥 Obtener proyecto completo (con versiones)
  @Get(":projectId")
  async getProject(@Param("projectId") projectId: string) {
    try {
      const project = await this.projectsService.findById(projectId);

      return {
        success: true,
        data: project,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // 🔥 Cambiar versión activa (como Figma)
  @Patch(":projectId/version")
  async setVersion(
    @Param("projectId") projectId: string,
    @Body() body: { version: number },
  ) {
    try {
      const project = await this.projectsService.setCurrentVersion(
        projectId,
        body.version,
      );

      return {
        success: true,
        data: project,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // 🔥 Obtener imagen actual
  @Get(":projectId/current-image")
  async getCurrentImage(@Param("projectId") projectId: string) {
    try {
      const imageUrl = await this.projectsService.getCurrentImage(projectId);

      return {
        success: true,
        url: imageUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
