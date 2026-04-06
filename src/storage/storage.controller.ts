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
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageService } from "./storage.service";
import axios from "axios";

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  // 🔹 SUBIR ARCHIVO
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException("Archivo requerido", HttpStatus.BAD_REQUEST);
    }

    const url = await this.storageService.uploadFile(file);

    return { url };
  }

  // 🔥 DESCARGA OPTIMIZADA (STREAM)
  @Get("download")
  async downloadFile(@Query("url") fileUrl: string, @Res() res: any) {
    if (!fileUrl) {
      throw new HttpException("URL requerida", HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get(fileUrl, {
        responseType: "stream", // 🔥 clave
      });

      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      res.set({
        "Content-Type": contentType,
        "Content-Disposition": `attachment`,
      });

      // 🔥 stream directo (NO usa RAM)
      response.data.pipe(res);
    } catch (error) {
      throw new HttpException(
        "Error descargando archivo",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get("files")
  async getFiles(@Query("prefix") prefix?: string) {
    const files = await this.storageService.listFiles(prefix);
    console.log(files);

    return {
      total: files.length,
      files,
    };
  }
  @Delete("delete")
  async delete(@Query("key") key: string) {
    await this.storageService.deleteByPath(key);
    return { ok: true };
  }
}
