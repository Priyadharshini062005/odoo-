import Image from "next/image";
import starFilled from "@/public/images/star-fill.png";
import starEmpty from "@/public/images/star-empty.png";

export default function Reviews({ product }: { product: any }) {
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <Image
          key={i}
          src={i < rating ? starFilled : starEmpty}
          alt="star"
          width={20}
          height={20}
          className="mr-1"
        />
      ));
  };

  return (
    <div className="bg-gray-200 py-8 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-6">
          Reviews ({product.reviews?.length || 0})
        </h2>
        <div className="space-y-6">
          {product.reviews?.map((review: any, index: any) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{review.reviewerName}</h3>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <small className="text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
