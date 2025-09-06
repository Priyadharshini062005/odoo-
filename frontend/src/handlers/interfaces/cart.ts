// interfaces/cart.d.ts
export interface ICartItem {
  userId?: string;
  productId: number;
  title: string;
  price: number;
  quantity: number;
  total?: number;
  carbonFootprintScore?: number;
  thumbnail?: string;
}

export interface ICartState {
  cart: {
    id: string;
    items: ICartItem[];
    userId: string;
    totalQuantity: number;
    totalPrice: number;
  };
  isLoading: boolean;
  error: string | null;
}
