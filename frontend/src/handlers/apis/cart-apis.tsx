"use client";
import axios from "axios";

const getCartItems = async (userId: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/${userId}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const addCartItem = async (cartItem: any) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/add`,
    cartItem,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const updateCartItemQuantity = async (
  userId: string,
  productId: number,
  quantity: number
) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/${userId}`,
    { productId: productId, quantity: quantity },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const removeCartItem = async (userId: string, productId: number) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/${userId}`,
    {
      data: { productId: productId },
      headers: { "Content-Type": "application/json" },
    }
  );
};

const clearCart = async (userId: string) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/`,
    {
      data: { userId: userId },
      headers: { "Content-Type": "application/json" },
    }
  );
};

const CART_APIs = {
  getCartItems,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};

export default CART_APIs;
