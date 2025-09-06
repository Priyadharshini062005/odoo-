import { IProduct, IProductState } from "@/src/handlers/interfaces/products";
import productReducer, {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../../src/handlers/redux/slices/productSlice";

describe("productSlice reducer", () => {
  const initialState: IProductState = {
    selectedProduct: null,
    products: [],
    isLoading: false,
    error: null,
  };

  const dummyProduct: IProduct = {
    id: 1,
    name: "Test Product",
    description: "Description",
    price: 100,
    title: "",
    thumbnail: "",
    rating: 0,
    stock: 0,
    category: "",
    brand: "",
    imageFile: {
      imageUrl: "",
      filename: "",
    },
  };

  it("should return initial state", () => {
    expect(productReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  describe("getProducts", () => {
    it("should handle pending", () => {
      const action = { type: getProducts.pending.type };
      const state = productReducer(initialState, action);
      expect(state).toEqual({ ...initialState, isLoading: true, error: null });
    });

    it("should handle fulfilled", () => {
      const action = {
        type: getProducts.fulfilled.type,
        payload: [dummyProduct],
      };
      const state = productReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        products: [dummyProduct],
      });
    });

    it("should handle rejected", () => {
      const action = { type: getProducts.rejected.type, payload: "error" };
      const state = productReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: "error",
      });
    });
  });

  describe("getProduct", () => {
    it("should handle pending", () => {
      const action = { type: getProduct.pending.type };
      const state = productReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null,
        selectedProduct: null,
      });
    });

    it("should handle fulfilled", () => {
      const action = { type: getProduct.fulfilled.type, payload: dummyProduct };
      const state = productReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        selectedProduct: dummyProduct,
      });
    });

    it("should handle rejected", () => {
      const action = { type: getProduct.rejected.type, payload: "error" };
      const state = productReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: "error",
      });
    });
  });

  describe("addProduct", () => {
    it("should handle pending", () => {
      const action = { type: addProduct.pending.type };
      const state = productReducer(initialState, action);
      expect(state).toEqual({ ...initialState, isLoading: true, error: null });
    });

    it("should handle fulfilled", () => {
      const action = { type: addProduct.fulfilled.type, payload: dummyProduct };
      const state = productReducer(initialState, action);
      expect(state.products).toContain(dummyProduct);
      expect(state.isLoading).toBe(false);
    });

    it("should handle rejected", () => {
      const action = { type: addProduct.rejected.type, payload: "error" };
      const state = productReducer(initialState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("deleteProduct", () => {
    const populatedState = {
      ...initialState,
      products: [dummyProduct],
    };

    it("should handle pending", () => {
      const action = { type: deleteProduct.pending.type };
      const state = productReducer(populatedState, action);
      expect(state).toEqual({
        ...populatedState,
        isLoading: true,
        error: null,
      });
    });

    it("should handle fulfilled", () => {
      const action = {
        type: deleteProduct.fulfilled.type,
        payload: dummyProduct.id.toString(),
      };
      const state = productReducer(populatedState, action);
      expect(state.products).not.toContainEqual(dummyProduct);
      expect(state.isLoading).toBe(false);
    });

    it("should handle rejected", () => {
      const action = { type: deleteProduct.rejected.type, payload: "error" };
      const state = productReducer(populatedState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("updateProduct", () => {
    const updatedProduct = { ...dummyProduct, name: "Updated Name" };
    const populatedState = {
      ...initialState,
      products: [dummyProduct],
    };

    it("should handle pending", () => {
      const action = { type: updateProduct.pending.type };
      const state = productReducer(populatedState, action);
      expect(state).toEqual({
        ...populatedState,
        isLoading: true,
        error: null,
      });
    });

    it("should handle fulfilled", () => {
      const action = {
        type: updateProduct.fulfilled.type,
        payload: updatedProduct,
      };
      const state = productReducer(populatedState, action);
      expect(state.products[0].name).toBe("Updated Name");
      expect(state.isLoading).toBe(false);
    });

    it("should handle rejected", () => {
      const action = { type: updateProduct.rejected.type, payload: "error" };
      const state = productReducer(populatedState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });
});
