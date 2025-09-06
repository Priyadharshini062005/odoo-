// pages/about.js
export default function About() {
  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center mb-6">About Us</h1>

        <div className="text-lg text-gray-700 leading-relaxed">
          <p className="mb-4">
            Welcome to <strong>Green Market Place</strong>, where our mission is
            to provide quality products and services to our valued customers.
            Established in [Year], we’ve been dedicated to excellence and
            customer satisfaction in every transaction.
          </p>
          <p className="mb-4">
            We strive to deliver products that enhance your lifestyle while
            upholding ethical standards and sustainable practices. Our dedicated
            team works tirelessly to bring you a wide range of high-quality
            items at competitive prices.
          </p>
          <p className="mb-4">
            Whether you&apos;re looking for the latest trends or reliable
            essentials, we&apos;re here to help make your shopping experience
            seamless and enjoyable. We believe in building lasting relationships
            with our customers, which is why we prioritize transparency,
            customer care, and innovation.
          </p>
          <p className="mb-4">
            Thank you for choosing us. Together, let&apos;s make every day
            better.
          </p>
        </div>
      </div>
    </div>
  );
}
