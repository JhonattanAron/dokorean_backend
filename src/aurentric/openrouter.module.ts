import { Module } from "@nestjs/common";
import { OpenRouterService } from "./openrouter.service";
import { OpenRouterController } from "./openrouter.controller";

@Module({
  providers: [OpenRouterService],
  controllers: [OpenRouterController],
  exports: [OpenRouterService],
})
export class OpenRouterModule {}
