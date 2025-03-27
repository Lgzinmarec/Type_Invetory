import { Category } from "./Category";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}