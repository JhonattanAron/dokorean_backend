import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3000", // desarrollo
      "https://dekorans.es",
      "https://dekorans.info",
      "https://dekorans.shop",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8082);
}
bootstrap();
