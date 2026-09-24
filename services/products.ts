import axiosInstance from "@/lib/axios";
import { GetProductsParams, Product, ProductsResponse } from "@/types/product";

let abortController: AbortController | null = null;

export const getProducts = async (
  params: GetProductsParams
): Promise<ProductsResponse> => {
  // Cancel previous in-flight request — fixes race condition
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  const { q, category, limit, skip, sortBy, order } = params;

  // DummyJSON cannot search and filter by category simultaneously.
  // When a search query is present, we use /products/search.
  // When a category is selected (no search), we use /products/category/{category}.
  // When neither, we use /products with optional sort params.

  let url = "/products";
  const queryParams: Record<string, string | number> = { limit, skip };

  if (q && q.trim()) {
    url = "/products/search";
    queryParams.q = q.trim();
    if (sortBy) queryParams.sortBy = sortBy;
    if (order) queryParams.order = order;
  } else if (category) {
    url = `/products/category/${category}`;
    if (sortBy) queryParams.sortBy = sortBy;
    if (order) queryParams.order = order;
  } else {
    if (sortBy) queryParams.sortBy = sortBy;
    if (order) queryParams.order = order;
  }

  const response = await axiosInstance.get<ProductsResponse>(url, {
    params: queryParams,
    signal: abortController.signal,
  });

  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/products/${id}`);
  return response.data;
};

export const addProduct = async (
  data: Partial<Product>
): Promise<Product> => {
  const response = await axiosInstance.post<Product>("/products/add", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>
): Promise<Product> => {
  const response = await axiosInstance.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};