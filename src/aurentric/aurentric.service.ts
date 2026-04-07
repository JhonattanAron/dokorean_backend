import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { StorageService } from "src/storage/storage.service";

@Injectable()
export class AurentricService {
  private readonly baseUrl = "http://localhost:8081/openrouter";

  constructor(private readonly storageService: StorageService) {}

  /**
   * Genera imagen desde prompt + referencias y sube a R2
   */
  async generateImageFromPrompt(
    prompt: string,
    referenceImages: any[],
  ): Promise<string> {
    try {
      // 1️⃣ Llamada al endpoint de generación
      const response = await axios.post(
        `${this.baseUrl}/generate`,
        {
          prompt,
          referenceImages,
        },
        {
          headers: {
            "x-api-key": process.env.AURENTRIC_API_KEY!,
            "Content-Type": "application/json",
          },
        },
      );

      // 2️⃣ Obtener Base64 de la respuesta
      const imageBase64 =
        response.data?.data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageBase64) {
        throw new Error("No se generó ninguna imagen Base64");
      }

      // 3️⃣ Subir a R2 usando StorageService optimizado
      const imageUrl =
        await this.storageService.uploadBase64ImageOptimized(imageBase64);

      // 4️⃣ Retornar solo la URL final
      return imageUrl;
    } catch (error: any) {
      console.error("Error al generar o subir imagen:", error.message || error);
      throw new HttpException(
        error.response?.data || "Error al generar imagen",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
