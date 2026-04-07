import { Module } from "@nestjs/common";
import { AurentricController } from "./aurentric.controller";
import { AurentricService } from "./aurentric.service";
import { StorageModule } from "src/storage/storage.module";

@Module({
  controllers: [AurentricController],
  providers: [AurentricService],
  exports: [AurentricService],
  imports: [StorageModule],
})
export class AurentricModule {}
