import axiosInstance from "@/lib/axios";
import type { Category } from "@/types/category";

export type { Category };

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>("/products/categories");
  return response.data;
};
