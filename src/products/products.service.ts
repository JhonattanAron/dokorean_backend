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
import { StorageService } from "src/storage/storage.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly storageService: StorageService,
  ) {}

  // Crear producto
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar duplicados por slug
    const exists = await this.productModel.findOne({
      slug: createProductDto.slug,
    });
    if (exists) {
      throw new ConflictException(
        `Producto con slug ${createProductDto.slug} ya existe`,
      );
    }

    const createdProduct = new this.productModel(createProductDto);
    return await createdProduct.save();
  }

  // Buscar todos los productos con paginación y búsqueda opcional
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
  ): Promise<{ data: Product[]; total: number; page: number; pages: number }> {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "description.general": { $regex: search, $options: "i" } },
        { "description.overview": { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

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
  // Buscar producto por _id
  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  // Buscar producto por slug
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug });
    if (!product) {
      throw new NotFoundException(`Producto con slug ${slug} no encontrado`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    const oldImages: string[] = existingProduct.images || [];
    const newImages: string[] = updateProductDto.images || [];

    const bucketName = process.env.GCS_BUCKET_NAME!;
    const bucketUrl = `https://storage.googleapis.com/${bucketName}/`;

    const removedUrls = oldImages.filter(
      (img) => img.startsWith(bucketUrl) && !newImages.includes(img),
    );

    await Promise.all(
      removedUrls.map((url) => this.storageService.deleteFile(url)),
    );

    Object.assign(existingProduct, updateProductDto);
    await existingProduct.save();

    return existingProduct;
  }

  // Eliminar producto por _id
  async remove(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return { message: `Producto ${id} eliminado correctamente` };
  }

  async findByName(slug: string): Promise<Product> {
    const product = await this.productModel.findOne({ slug });
    if (!product) {
      throw new NotFoundException(`Producto con name ${slug} no encontrado`);
    }
    return product;
  }
}
