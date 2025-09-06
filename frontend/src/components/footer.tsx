// components/Footer.js
"use client";
import Link from "next/link";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white py-8">
      <div className="container mx-auto flex justify-between px-4">
        {/* About Section */}
        <div>
          <h4 className="text-lg font-semibold">
            <strong>About Us</strong>
          </h4>
          <p className="text-sm mt-2">
            We are dedicated to providing the best quality products and service
            to our customers.
            <a
              href="https://www.flaticon.com/free-icons/user"
              title="user icons"
            >
              User icons created by kmg design - Flaticon
            </a>
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h4 className="text-lg font-semibold">
            <strong>Quick Links</strong>
          </h4>
          <ul className="text-sm mt-2 space-y-1">
            <li>
              <Link href="/shop" className="text-gray-800">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-800">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-800">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-gray-800">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h4 className="text-lg font-semibold">
            <strong>Follow Us</strong>
          </h4>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
