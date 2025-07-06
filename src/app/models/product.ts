export interface Product {
  id: string;
  code: string;
  name: string;
  category?: string;
  stock: number;
  image?: string; // base64 o URL
  createdAt: number;
}
