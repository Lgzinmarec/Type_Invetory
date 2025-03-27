import { Product } from "../models/Product";
import { CategoryService } from "./CategoryService";

export class ProductService {
  private products: Product[] = [];

  constructor(private categoryService: CategoryService) {}

  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product | undefined {
    if (!this.categoryService.findById(product.categoryId)) {
      return undefined;
    }

    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return [...this.products];
  }

  findById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  findByName(name: string): Product[] {
    return this.products.filter(p => 
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  findByCategory(categoryId: string): Product[] {
    return this.products.filter(p => p.categoryId === categoryId);
  }

  update(id: string, updateData: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | undefined {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) return undefined;

    if (updateData.categoryId && !this.categoryService.findById(updateData.categoryId)) {
      return undefined;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.products[productIndex];
  }

  delete(id: string): boolean {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) return false;

    this.products.splice(productIndex, 1);
    return true;
  }
}