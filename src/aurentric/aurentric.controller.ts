import { Controller, Post, Body } from "@nestjs/common";
import { AurentricService } from "./aurentric.service";

interface ReferenceImageDto {
  url: string;
  role: string;
  priority?: "alta" | "media" | "baja";
}

interface GenerateImageDto {
  prompt: string;
  referenceImages?: ReferenceImageDto[];
}

@Controller("aurentric")
export class AurentricController {
  constructor(private readonly aurentricService: AurentricService) {}

  @Post("generate")
  async generateImage(@Body() body: GenerateImageDto) {
    const { prompt, referenceImages } = body;

    if (!prompt) {
      return { success: false, message: "Prompt es obligatorio" };
    }

    if (!referenceImages || referenceImages.length === 0) {
      return {
        success: false,
        message: "Debes enviar al menos una imagen de referencia",
      };
    }

    try {
      // Llama al servicio que genera la imagen y la sube a R2
      const imageUrl = await this.aurentricService.generateImageFromPrompt(
        prompt,
        referenceImages,
      );

      return { success: true, url: imageUrl };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error generando la imagen",
      };
    }
  }
}
