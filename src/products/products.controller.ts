import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Delete("bulk")
  @HttpCode(200)
  removeBulk(@Body() body: { ids: string[] }) {
    return this.productsService.removeBulk(body.ids);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search?: string,
    @Query("category") category?: string,
  ) {
    return this.productsService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      category,
    );
  }

  @Get("name/:name")
  findOne(@Param("name") name: string) {
    return this.productsService.findByName(name);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.productsService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);

    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @HttpCode(200)
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }

  @Patch("bulk/categories")
  updateCategoriesBulk(@Body() body: { ids: string[]; categories: string[] }) {
    return this.productsService.updateCategoriesBulk(body.ids, body.categories);
  }
}
