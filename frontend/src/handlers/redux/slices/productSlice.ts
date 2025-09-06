// handlers/redux/slices/productSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import PRODUCT_APIs from "../../apis/product-apis";
import { IProduct, IProductState } from "../../interfaces/products";
import {
  getProductFromDB,
  getProductsFromDB,
  saveProductsToDB,
} from "@/src/utils/db";
import { toast } from "react-toastify";

// Define the initial state with proper types
const initialState: IProductState = {
  selectedProduct: null,
  products: [],
  isLoading: false,
  error: null,
};

// Thunks for async actions

// Fetch list of all products
export const getProducts = createAsyncThunk<
  IProduct[],
  void,
  { rejectValue: any }
>("products/getProducts", async (_, { rejectWithValue }) => {
  try {
    // Get all products
    const response = await PRODUCT_APIs.getProducts();

    // Cache blogs in IndexedDB
    await saveProductsToDB(response.data);

    return response.data;
  } catch (error: any) {
    console.log(`ERROR: ${error.message}`);
    if (error.message == "Network Error") {
      toast.info("Network Failed: You are accessing offline mode.", {
        position: "top-right",
      });
      // Fallback to cached blogs
      const cachedProducts = await getProductsFromDB();
      if (cachedProducts.length > 0) {
        return cachedProducts;
      }
    }
    return rejectWithValue(
      error.response?.data?.message || "Failed to get products."
    );
  }
});

// Fetch individual product by ID
export const getProduct = createAsyncThunk<
  IProduct,
  number,
  { rejectValue: any }
>("products/getProduct", async (id, { rejectWithValue }) => {
  try {
    // Get product by id
    const response = await PRODUCT_APIs.getProduct(id);
    const product: any = response.data;

    // Cache the blog in IndexedDB
    await saveProductsToDB([product]);

    return product;
  } catch (error: any) {
    console.log(`ERROR: ${error.message}`);
    if (error.message == "Network Error") {
      toast.info("Network Failed: You are accessing offline mode.", {
        position: "top-right",
      });
      // Fallback to cached blog
      const cachedProduct = await getProductFromDB(id);
      if (cachedProduct) {
        return cachedProduct;
      }
    }
    return rejectWithValue(
      error.response?.data?.message || "Failed to get product."
    );
  }
});

// Create a new product
export const addProduct = createAsyncThunk<
  IProduct,
  IProduct,
  { rejectValue: any }
>("products/addProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await PRODUCT_APIs.addProduct(productData);

    return response.data; // Assumed response.data is of type Product
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create product."
    );
  }
});

// Delete a product by ID
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: any }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await PRODUCT_APIs.deleteProduct(id);
    return id; // Return the ID of the deleted product
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete product."
    );
  }
});

// Update an existing product by ID
export const updateProduct = createAsyncThunk<
  IProduct,
  { id: number; updatedData: IProduct },
  { rejectValue: any }
>(
  "products/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await PRODUCT_APIs.updateProduct(id, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product."
      );
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // You can add additional synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      // Get all products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProducts.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.isLoading = false;
          state.products = action.payload;
        }
      )
      .addCase(getProducts.rejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get individual product
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(
        getProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.isLoading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(getProduct.rejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create a new product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.isLoading = false;
          state.products.push(action.payload); // Add the new product to the list
        }
      )
      .addCase(addProduct.rejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete a product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.products = state.products.filter(
            (product) => product.id !== action.payload
          ); // Remove the deleted product
        }
      )
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

      // Update a product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.isLoading = false;
          const index = state.products.findIndex(
            (product) => product.id === action.payload.id
          );
          if (index !== -1) {
            state.products[index] = action.payload; // Update the existing product
          }
        }
      )
      .addCase(
        updateProduct.rejected,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export default productSlice.reducer;
