// interfaces/products.ts

export interface IProduct {
  id: string | number;
  name?: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock: number;
  category: string;
  brand: string;
  imageFile: { imageUrl: string; filename: string };
}

export interface IProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  isLoading: boolean;
  error: string | null;
}
