import cartReducer, {
  fetchCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../../src/handlers/redux/slices/cartSlice";

import { ICartState, ICartItem } from "../../src/handlers/interfaces/cart";

describe("cartSlice reducer", () => {
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

  const dummyCart = {
    id: "cart1",
    userId: "user1",
    items: [
      {
        productId: 1,
        quantity: 2,
        price: 100,
      },
    ],
    totalQuantity: 2,
    totalPrice: 200,
  };

  it("should return initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("fetchCartItems", () => {
    it("handles pending", () => {
      const action = { type: fetchCartItems.pending.type };
      const state = cartReducer(initialState, action);
      expect(state).toEqual({ ...initialState, isLoading: true, error: null });
    });

    it("handles fulfilled", () => {
      const action = {
        type: fetchCartItems.fulfilled.type,
        payload: dummyCart,
      };
      const state = cartReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        cart: dummyCart,
      });
    });

    it("handles rejected", () => {
      const action = { type: fetchCartItems.rejected.type, payload: "error" };
      const state = cartReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: "error",
      });
    });
  });

  describe("addCartItem", () => {
    it("handles pending", () => {
      const action = { type: addCartItem.pending.type };
      const state = cartReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const action = { type: addCartItem.fulfilled.type, payload: dummyCart };
      const state = cartReducer(initialState, action);
      expect(state.cart).toEqual(dummyCart);
      expect(state.isLoading).toBe(false);
    });

    it("handles rejected", () => {
      const action = { type: addCartItem.rejected.type, payload: "error" };
      const state = cartReducer(initialState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("updateCartItemQuantity", () => {
    it("handles pending", () => {
      const action = { type: updateCartItemQuantity.pending.type };
      const state = cartReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const action = {
        type: updateCartItemQuantity.fulfilled.type,
        payload: dummyCart,
      };
      const state = cartReducer(initialState, action);
      expect(state.cart).toEqual(dummyCart);
      expect(state.isLoading).toBe(false);
    });

    it("handles rejected", () => {
      const action = {
        type: updateCartItemQuantity.rejected.type,
        payload: "error",
      };
      const state = cartReducer(initialState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("removeCartItem", () => {
    it("handles pending", () => {
      const action = { type: removeCartItem.pending.type };
      const state = cartReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const action = {
        type: removeCartItem.fulfilled.type,
        payload: dummyCart,
      };
      const state = cartReducer(initialState, action);
      expect(state.cart).toEqual(dummyCart);
      expect(state.isLoading).toBe(false);
    });

    it("handles rejected", () => {
      const action = { type: removeCartItem.rejected.type, payload: "error" };
      const state = cartReducer(initialState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("clearCart", () => {
    it("handles pending", () => {
      const action = { type: clearCart.pending.type };
      const state = cartReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("handles fulfilled", () => {
      const emptyCart = {
        ...dummyCart,
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      };
      const action = { type: clearCart.fulfilled.type, payload: emptyCart };
      const state = cartReducer(initialState, action);
      expect(state.cart).toEqual(emptyCart);
      expect(state.isLoading).toBe(false);
    });

    it("handles rejected", () => {
      const action = { type: clearCart.rejected.type, payload: "error" };
      const state = cartReducer(initialState, action);
      expect(state.error).toBe("error");
      expect(state.isLoading).toBe(false);
    });
  });
});
