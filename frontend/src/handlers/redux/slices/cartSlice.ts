import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import CART_APIs from "../../apis/cart-apis"; // Replace with actual API file if you have one
import { ICartItem, ICartState } from "../../interfaces/cart";

// Define the initial state for the cart
const initialState: ICartState = {
  cart: {
    id: "",
    items: [],
    userId: "",
    totalQuantity: 0,
    totalPrice: 0,
  },
  isLoading: false,
  error: null,
};

// Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk<
  ICartItem[],
  string,
  { rejectValue: any }
>("cart/fetchCartItems", async (userId, { rejectWithValue }) => {
  try {
    const response = await CART_APIs.getCartItems(userId); // Replace with your API call
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch cart items."
    );
  }
});

// Async thunk to add an item to the cart
export const addCartItem = createAsyncThunk<
  ICartItem,
  ICartItem,
  { rejectValue: any }
>("cart/addCartItem", async (item, { rejectWithValue }) => {
  try {
    const response = await CART_APIs.addCartItem(item); // Replace with your API call
    return response.data.cart;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add item to cart."
    );
  }
});

// Async thunk to update an item quantity in the cart
export const updateCartItemQuantity = createAsyncThunk<
  ICartItem,
  { userId: string; productId: number; quantity: number },
  { rejectValue: any }
>(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await CART_APIs.updateCartItemQuantity(
        userId,
        productId,
        quantity
      ); // Replace with your API call
      return response.data.cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update item quantity."
      );
    }
  }
);

// Async thunk to remove an item from the cart
export const removeCartItem = createAsyncThunk<
  number,
  { productId: number; userId: string },
  { rejectValue: any }
>("cart/removeCartItem", async ({ userId, productId }, { rejectWithValue }) => {
  try {
    const response = await CART_APIs.removeCartItem(userId, productId); // Replace with your API call
    return response.data.cart;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove item from cart."
    );
  }
});

// Async thunk to clear the cart
export const clearCart = createAsyncThunk<
  void,
  string, // Accepts the `userId` as a parameter
  { rejectValue: any }
>("cart/clearCart", async (userId, { rejectWithValue }) => {
  try {
    const cartResponse: any = await CART_APIs.clearCart(userId); // Replace with your actual API call
    return cartResponse.cart;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to clear cart."
    );
  }
});

// Cart slice
const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCartItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.cart = action.payload;
        }
      )
      .addCase(fetchCartItems.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add a cart item
      .addCase(addCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(addCartItem.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateCartItemQuantity.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.cart = action.payload;
        }
      )
      .addCase(
        updateCartItemQuantity.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Remove a cart item
      .addCase(removeCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.cart = action.payload;
        }
      )
      .addCase(removeCartItem.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
