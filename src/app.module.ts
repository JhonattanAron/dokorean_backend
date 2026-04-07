import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductsModule } from "./products/products.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { StorageModule } from "./storage/storage.module";
import { CategoriesModule } from "./categorys/categories.module";
import { UsersProjectsModule } from "./users_projects/users_projects.module";
import { AurentricModule } from "./aurentric/aurentric.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || ""),
    ProductsModule,
    StorageModule,
    CategoriesModule,
    UsersProjectsModule,
    AurentricModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
