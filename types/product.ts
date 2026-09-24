export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    stock: number;
    category: string;
    thumbnail: string;
    images: string[];
    reviews: Review[];
  }
  
  export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }
  
  export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
  }
  
  export interface GetProductsParams {
    limit: number;
    skip: number;
    q?: string;
    category?: string;
    sortBy?: "price" | "rating" | "title";
    order?: "asc" | "desc";
  }