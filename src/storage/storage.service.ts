import { Injectable } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import sharp from "sharp";

@Injectable()
export class StorageService {
  private s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  private bucket = process.env.R2_BUCKET_NAME!;
  private publicUrl = process.env.R2_PUBLIC_URL!;

  /* ---------------- SUBIR ---------------- */
  slugify(filename: string) {
    return filename
      .toLowerCase() // todo minúsculas
      .replace(/\s+/g, "-") // espacios a guiones
      .replace(/[^a-z0-9\-\.]/g, "") // eliminar caracteres raros
      .replace(/-+/g, "-") // varios guiones seguidos a uno solo
      .replace(/^\-|\-$/g, ""); // quitar guiones al inicio/final
  }

  async uploadFile(file: Express.Multer.File) {
    // Obtener la extensión
    const ext = file.originalname.split(".").pop();
    // Crear un nombre base "slug"
    const baseName = file.originalname.replace(/\.[^/.]+$/, "");
    // Combinar con un fragmento de UUID para que sea único
    const fileName = `${this.slugify(baseName)}-${randomUUID().slice(0, 8)}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      url: `${this.publicUrl}/${fileName}`,
      key: fileName,
    };
  }

  async uploadBase64ImageOptimized(base64Image: string): Promise<string> {
    // 1️⃣ Separar el header del Base64
    const matches = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) throw new Error("Formato Base64 inválido");

    const imageData = matches[2];

    // 2️⃣ Convertir a Buffer
    const buffer = Buffer.from(imageData, "base64");

    // 3️⃣ Procesar con Sharp
    const optimizedBuffer = await sharp(buffer)
      .rotate() // corrige orientación según EXIF
      .resize({ width: 1024, withoutEnlargement: true }) // ancho máximo 1024px
      .webp({ quality: 75, lossless: false }) // WebP ligero
      .toBuffer();

    // 4️⃣ Crear un archivo temporal tipo Express.Multer.File
    const file: Express.Multer.File = {
      buffer: optimizedBuffer,
      originalname: `image-${Date.now()}.webp`,
      mimetype: "image/webp",
      size: optimizedBuffer.length,
      fieldname: "file",
      encoding: "7bit",
      destination: "",
      filename: "",
      path: "",
      stream: undefined as any,
    };

    // 5️⃣ Subir a S3 usando tu servicio
    const uploadResult = await this.uploadFile(file);

    // 6️⃣ Retornar solo la URL
    return uploadResult.url;
  }
  /* ---------------- DELETE ---------------- */

  async deleteByPath(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async deleteFile(fileUrl: string) {
    try {
      if (!fileUrl.includes(this.publicUrl)) return;

      const key = fileUrl.replace(`${this.publicUrl}/`, "");

      await this.deleteByPath(key);
    } catch (error) {
      console.error("Error eliminando archivo:", error);
    }
  }

  /* ---------------- SIGNED URL ---------------- */

  async generateDownloadUrl(fileUrl: string): Promise<string> {
    if (!fileUrl.includes(this.publicUrl)) return fileUrl;

    const key = fileUrl.replace(`${this.publicUrl}/`, "");

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: 60 * 5,
    });
  }

  /* ---------------- LIST ---------------- */

  async listFiles(prefix: string = "") {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    const response = await this.s3.send(command);

    if (!response.Contents) return [];

    return response.Contents.map((item) => ({
      key: item.Key!,
      url: `${this.publicUrl}/${item.Key}`,
      size: item.Size || 0,
      lastModified: item.LastModified,
    }));
  }
}
