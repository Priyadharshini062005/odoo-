"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/src/handlers/redux/hooks";
import { getProduct } from "@/src/handlers/redux/slices/productSlice";
import Image from "next/image";

import ProductImage from "@/src/components/productImage";
import ProductInfo from "@/src/components//productInfo";
import ProductDetails from "@/src/components/productDetails";
import Reviews from "@/src/components/reviews";
import SustainabilityBanner from "@/src/components/SustainabilityBanner";
import Sustainability from "@/src/components/sustainability";
import BACK_ARROW_IMAGE from "@/public/images/back-arrow.png";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const product = useAppSelector(
    (state: any) => state.products.selectedProduct
  );

  useEffect(() => {
    setMounted(true);
    const { id } = params;
    dispatch(getProduct(parseInt(id))).then((action) => {
      if (!getProduct.fulfilled.match(action)) {
        toast.error("Failed to load product.");
      }
    });
  }, [params]);

  if (!mounted || !product) return <div className="min-h-screen"></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="p-2 bg-gray-200 my-5 mx-5 rounded-full hover:bg-green-100 transition duration-150"
        title="Back"
      >
        <Image src={BACK_ARROW_IMAGE} alt="BACK" width={24} height={24} />
      </button>

      {/* Sustainability Banner */}
      <div className="animate-fadeIn">
        <SustainabilityBanner
          carbonFootprintScore={
            product.sustainability?.carbonFootprintScore || "N/A"
          }
          description={
            product.sustainability?.shortDescription ||
            "Sustainability is key to a healthier planet. Support eco-friendly products!"
          }
        />
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImage product={product} />
          <ProductInfo product={product} />
        </div>
      </div>

      <ProductDetails product={product} />
      <Sustainability product={product} />
      <Reviews product={product} />
    </div>
  );
}
