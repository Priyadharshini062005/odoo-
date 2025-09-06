"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/src/handlers/redux/hooks";
import { toast } from "react-toastify";
import { getProducts } from "@/src/handlers/redux/slices/productSlice";
import {
  addCartItem,
  updateCartItemQuantity,
} from "@/src/handlers/redux/slices/cartSlice";
import ECO_CERTIFIED_IMAGE from "@/public/images/eco.png";
import QUALITY_IMAGE from "@/public/images/quality.png";
import CERTIFIED_IMAGE from "@/public/images/certified.png";
import BADGE_IMAGE from "@/public/images/certified.png";
import CERT_IMAGE from "@/public/images/cert.png";
import ADD_TO_CART_IMAGE from "@/public/images/add-to-cart.png";

export default function Products() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();

  const { products, loading, error } = useAppSelector(
    (state: any) => state.products
  );
  const user = useAppSelector((state: any) => state.auth.user);
  const cart = useAppSelector((state: any) => state.carts.cart);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    dispatch(getProducts()).then((action) => {
      if (!getProducts.fulfilled.match(action)) {
        toast.error("Failed to load products.");
      }
    });
  }, [dispatch]);

  const filteredProducts = products.filter((product: any) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    const existingItem = cart?.items?.find(
      (item: any) => item.productId === product.id
    );
    if (existingItem) {
      dispatch(
        updateCartItemQuantity({
          userId: user.id,
          productId: product.id,
          quantity: existingItem.quantity + 1,
        })
      );
      toast.info(`${product.title} quantity updated!`);
    } else {
      dispatch(
        addCartItem({
          userId: user.id,
          productId: product.id,
          title: product.title,
          price: product.price,
          carbonFootprintScore: product?.sustainability?.carbonFootprintScore,
          thumbnail: product.thumbnail,
          quantity: 1,
        })
      );
      toast.success(`${product.title} added to cart!`);
    }
  };

  const handleUpdateQuantity = (product: any, quantity: number) => {
    if (quantity < 1) return; // Ensure quantity doesn't go below 1
    dispatch(
      updateCartItemQuantity({
        userId: user.id,
        productId: product.id,
        quantity,
      })
    );
  };

  const certifiedImage = (certification: string): any => {
    if (certification.toLowerCase().includes("eco")) {
      return ECO_CERTIFIED_IMAGE;
    } else if (certification.toLowerCase().includes("sustainable")) {
      return QUALITY_IMAGE;
    } else if (certification.toLowerCase().includes("certification")) {
      return CERTIFIED_IMAGE;
    } else if (certification.toLowerCase().includes("recycle")) {
      return BADGE_IMAGE;
    } else {
      return CERT_IMAGE;
    }
  };

  if (!mounted || !products) return <div className="min-h-screen"></div>;

  return (
    <div className="min-h-screen container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Product Listing</h1>
        <div className="flex items-center space-x-6">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Product Listing */}
      {loading ? (
        <div className="text-center">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500">
            Failed to load products. Try again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts?.map((product: any) => {
            const cartItem = cart?.items?.find(
              (item: any) => item.id === product.id
            );

            return (
              <div
                key={product.id}
                className="relative rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  {product.sustainability?.certifications.map(
                    (certificate: string, index: number) => (
                      <div key={index} className="relative group">
                        {/* Image */}
                        <Image
                          src={certifiedImage(certificate)}
                          alt={product.title}
                          width={40}
                          height={40}
                          className="object-cover rounded"
                          priority
                        />

                        {/* Description on hover */}
                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-max px-3 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {certificate}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.thumbnail || `/images/default-product.jpg`}
                    alt={product.title}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded mb-4"
                    priority
                  />
                </Link>
                <h2 className="text-lg font-semibold mb-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:text-blue-500"
                  >
                    {product.title}
                  </Link>
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-l font-bold">
                    <s>€{product.price.toFixed(2)}</s>
                  </span>
                  <span className="text-l text-red-600 animate-blink">
                    {product.discountPercentage}% off
                  </span>
                </div>
                <span className="text-xl font-bold">
                  €
                  {(
                    product.price -
                    product.price * (product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>

                {/* Add to Cart or Quantity Controls */}
                <div className="mt-4">
                  {cartItem ? (
                    <div className="flex items-center space-x-4">
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          handleUpdateQuantity(product, cartItem.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="text-lg">{cartItem.quantity}</span>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          handleUpdateQuantity(product, cartItem.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      {user && (
                        <button
                          className="btn-primary"
                          onClick={() => handleAddToCart(product)}
                        >
                          <Image
                            src={ADD_TO_CART_IMAGE}
                            alt={"Add to Cart"}
                            width={30}
                            height={30}
                            className="object-cover rounded"
                            priority
                          />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
