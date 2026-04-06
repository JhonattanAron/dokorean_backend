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

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${randomUUID()}-${file.originalname}`;

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
      key: fileName, // 🔥 IMPORTANTE
    };
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
