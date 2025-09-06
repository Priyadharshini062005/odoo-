export default function ProductDetails({ product }: { product: any }) {
  return (
    <div className="bg-white py-8 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Product Information</h2>
        <ul className="text-lg text-gray-700 space-y-4">
          <li>
            <strong>Dimensions:</strong>{" "}
            {`${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}` ||
              "N/A"}
          </li>
          <li>
            <strong>Warranty:</strong> {product.warrantyInformation || "N/A"}
          </li>
          <li>
            <strong>Shipping:</strong> {product.shippingInformation || "N/A"}
          </li>
          <li>
            <strong>Return Policy:</strong> {product.returnPolicy || "N/A"}
          </li>
        </ul>
      </div>
    </div>
  );
}
