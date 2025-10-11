export interface PostImage {
  image_id: number;
  url: string;
  uploaded_at: string;
}

export interface PostType {
  type_id: number;
  type_name: string; // "Venta" | "Compra"
}

export interface Product {
  product_id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface User {
  user_id: number;
  name: string;
}

export interface Municipality {
  municipality_id: number;
  name: string;
  department_id: number;
}

export interface Post {
  post_id: number;
  title: string;
  description: string;
  quantity_kg?: number | null;
  price_per_kg?: number | null;
  created_at: string;
  updated_at: string;
  post_type: PostType;
  product: Product;
  user: User;
  municipality: Municipality;
  images: PostImage[];
}
