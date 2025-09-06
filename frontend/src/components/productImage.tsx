import { useState } from "react";
import Image from "next/image";
import productDefault from "@/public/images/product-default.png";

export default function ProductImage({ product }: { product: any }) {
  const [imageState, setImageState] = useState("default"); // "default" | "thumbnail" | "highRes"

  const getCurrentImage = () => {
    switch (imageState) {
      case "highRes":
        return product.images[0];
      case "thumbnail":
        return product.thumbnail;
      default:
        return productDefault;
    }
  };

  const handleThumbnailLoad = () => setImageState("thumbnail");
  const handleHighResLoad = () => setImageState("highRes");

  return (
    <div className="relative flex justify-center">
      <Image
        src={getCurrentImage()}
        alt={product.title}
        width={500}
        height={500}
        className="w-full h-auto object-cover rounded-lg shadow-lg"
        priority
        onLoad={
          imageState === "default" ? handleThumbnailLoad : handleHighResLoad
        }
      />
    </div>
  );
}
