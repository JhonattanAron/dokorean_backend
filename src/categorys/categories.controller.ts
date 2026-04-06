import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  Patch,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./create-category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get("main")
  findMain() {
    return this.categoriesService.findMainCategories();
  }

  @Get(":parentId/sub")
  findSub(@Param("parentId") parentId: string) {
    return this.categoriesService.findSubCategories(parentId);
  }
  @Get("tree")
  getTreeCategory() {
    return this.categoriesService.getTree();
  }
  @Post("import")
  importCategories(@Body() categories: any[]) {
    return this.categoriesService.importCategories(categories);
  }
  @Delete(":id")
  @HttpCode(200)
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }
}
