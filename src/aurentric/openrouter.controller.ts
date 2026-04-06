import { Controller, Post, Body } from "@nestjs/common";
import { OpenRouterService } from "./openrouter.service";

// 🔥 DTO correcto
interface ReferenceImageDto {
  url: string;
  role: string;
  priority?: "alta" | "media" | "baja";
}

interface GenerateImageDto {
  prompt: string;
  referenceImages?: ReferenceImageDto[];
}

@Controller("openrouter")
export class OpenRouterController {
  constructor(private readonly openRouterService: OpenRouterService) {}

  @Post("generate")
  async generateImage(@Body() body: GenerateImageDto) {
    const { prompt, referenceImages } = body;

    // 🔒 validación básica
    if (!prompt) {
      throw new Error("El prompt es obligatorio");
    }

    const result = await this.openRouterService.generateImage(
      prompt,
      referenceImages,
    );

    return {
      success: true,
      data: result,
    };
  }
}
