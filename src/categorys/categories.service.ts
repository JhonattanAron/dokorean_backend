import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./category.schema";
import { CreateCategoryDto } from "./create-category.dto";
import { CategoryTree } from "./types/category-tree.type";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = new this.categoryModel({
      name: dto.name,
      parent: dto.parent || null,
      level: dto.parent ? 1 : 0,
      icon: dto.icon,
      slug: dto.name.toLowerCase().replace(/\s+/g, "-"),
    });

    return category.save();
  }

  async findAll() {
    return this.categoryModel.find();
  }

  async findMainCategories() {
    return this.categoryModel.find({ parent: null });
  }

  async findSubCategories(parentId: string) {
    return this.categoryModel.find({ parent: parentId });
  }

  async getTree() {
    const categories = await this.categoryModel.find().lean();

    const map = new Map<string, CategoryTree>();
    const roots: CategoryTree[] = [];

    for (const cat of categories) {
      map.set(cat._id.toString(), {
        ...cat,
        children: [],
      });
    }

    for (const cat of categories) {
      const node = map.get(cat._id.toString());

      if (!node) continue;

      if (cat.parent) {
        const parent = map.get(cat.parent.toString());

        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
  async importCategories(categories: any[]) {
    const parentMap: Record<string, any> = {};

    const mains = categories.filter((c) => c.level === 0);
    const subs = categories.filter((c) => c.level === 1);

    // Crear categorías principales
    for (const cat of mains) {
      const created = await this.categoryModel.findOneAndUpdate(
        { slug: cat.slug },
        {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          parent: null,
          level: 0,
        },
        { upsert: true, new: true },
      );

      parentMap[cat.slug] = created._id;
    }

    // Crear subcategorías
    for (const sub of subs) {
      let parentId = parentMap[sub.parent];

      // Si no está en el mapa, buscar en la DB
      if (!parentId) {
        const parent = await this.categoryModel.findOne({ slug: sub.parent });
        if (parent) {
          parentId = parent._id;
        }
      }

      if (!parentId) {
        console.warn(`Parent no encontrado para ${sub.name}`);
        continue;
      }

      await this.categoryModel.findOneAndUpdate(
        { slug: sub.slug },
        {
          name: sub.name,
          slug: sub.slug,
          icon: sub.icon,
          parent: parentId,
          level: 1,
        },
        { upsert: true, new: true },
      );
    }

    return {
      message: "Categorias importadas correctamente",
    };
  }
}
