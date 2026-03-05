import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

@Injectable()
export class StorageService {
  private storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  private bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME!);

  // 🔹 SUBIR ARCHIVO
  async uploadFile(file: Express.Multer.File) {
    const fileName = `products/${randomUUID()}-${file.originalname}`;
    const blob = this.bucket.file(fileName);

    await blob.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${fileName}`;
  }

  async deleteByPath(path: string) {
    await this.bucket.file(path).delete();
  }

  // 🔥 BORRAR ARCHIVO DESDE URL
  async deleteFile(fileUrl: string) {
    try {
      const bucketName = process.env.GCS_BUCKET_NAME!;
      const filePath = fileUrl.split(`${bucketName}/`)[1];

      if (!filePath) return;

      await this.bucket.file(filePath).delete();
    } catch (error) {
      console.error("Error eliminando archivo del bucket:", error);
    }
  }

  async generateDownloadUrl(fileUrl: string): Promise<string> {
    const bucketName = process.env.GCS_BUCKET_NAME!;

    if (!fileUrl) {
      throw new Error("fileUrl es requerido");
    }

    const url = new URL(fileUrl);

    // 🔥 SI NO ES DE GOOGLE STORAGE → DEVOLVER TAL CUAL
    const isGoogleStorage =
      url.hostname === "storage.googleapis.com" ||
      url.hostname.includes("storage.googleapis.com");

    if (!isGoogleStorage) {
      return fileUrl; // externa → no firmar
    }

    let filePath = "";

    // Caso 1: https://storage.googleapis.com/bucket-name/path/file.jpg
    if (url.hostname === "storage.googleapis.com") {
      const parts = url.pathname.split("/");
      filePath = parts.slice(2).join("/");
    }

    // Caso 2: https://bucket-name.storage.googleapis.com/path/file.jpg
    else if (url.hostname.includes(`${bucketName}.storage.googleapis.com`)) {
      filePath = url.pathname.substring(1);
    }

    // 🔥 Si no es tu bucket → devolver normal
    if (!filePath) {
      return fileUrl;
    }

    // 🔥 Generar signed URL solo si es tu bucket
    const [signedUrl] = await this.bucket.file(filePath).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 5 * 60 * 1000,
    });

    return signedUrl;
  }
}
