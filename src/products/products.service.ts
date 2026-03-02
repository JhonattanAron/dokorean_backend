/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "./schemas/product.schema";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { format } from "path";
import { formatName } from "src/lib/utils";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const createdProduct = new this.productModel(createProductDto);
      return await createdProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Producto con externalId ${createProductDto.externalId} ya existe`,
        );
      }
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Product[]; total: number; page: number; pages: number }> {
    const skip = (page - 1) * limit;
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { externalId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const data = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.productModel.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { data, total, page, pages };
  }

  async findByName(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug });
    if (!product) {
      throw new NotFoundException(`Producto con name ${slug} no encontrado`);
    }
    return product;
  }

  async findByExternalId(externalId: string): Promise<Product> {
    const product = await this.productModel.findOne({ externalId });
    if (!product) {
      throw new NotFoundException(
        `Producto con externalId ${externalId} no encontrado`,
      );
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return { message: `Producto ${id} eliminado correctamente` };
  }

  async removeByExternalId(externalId: string): Promise<{ message: string }> {
    const product = await this.productModel.findOneAndDelete({ externalId });

    if (!product) {
      throw new NotFoundException(
        `Producto con externalId ${externalId} no encontrado`,
      );
    }

    return {
      message: `Producto con externalId ${externalId} eliminado correctamente`,
    };
  }
}
