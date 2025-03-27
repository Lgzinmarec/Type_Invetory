import { Category } from "../models/Category";

export class CategoryService {
  private categories: Category[] = [];

  create(category: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date()
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  findAll(): Category[] {
    return [...this.categories];
  }

  findById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  findByName(name: string): Category | undefined {
    return this.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  }

  update(id: string, updateData: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | undefined {
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) return undefined;

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData
    };

    return this.categories[categoryIndex];
  }

  delete(id: string): boolean {
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) return false;

    this.categories.splice(categoryIndex, 1);
    return true;
  }

  hasProducts(categoryId: string): boolean {
    return false;
  }
}