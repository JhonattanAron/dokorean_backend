import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageService } from "./storage.service";
import axios from "axios";

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.storageService.uploadFile(file);

    return {
      url,
    };
  }
  @Get("download")
  async downloadFile(@Query("url") fileUrl: string, @Res() res: any) {
    if (!fileUrl) {
      throw new HttpException("URL requerida", HttpStatus.BAD_REQUEST);
    }

    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const contentType =
      response.headers["content-type"] || "application/octet-stream";

    // 🔥 Forzar descarga
    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="imagen"`,
    });

    return res.send(response.data);
  }
}
