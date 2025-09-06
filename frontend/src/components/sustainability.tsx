export default function Sustainability({ product }: { product: any }) {
  return (
    <div className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Sustainability</h2>
        <ul className="text-lg text-gray-700 space-y-4">
          <li>
            <strong>Description:</strong>{" "}
            {product.sustainability?.shortDescription || "N/A"}
          </li>
          <li>
            <strong>Certifications:</strong>{" "}
            {product.sustainability?.certifications?.join(", ") || "N/A"}
          </li>
          <li>
            <strong>Carbon Footprint Score:</strong>{" "}
            {product.sustainability?.carbonFootprintScore || "N/A"}
          </li>
        </ul>
      </div>
    </div>
  );
}
