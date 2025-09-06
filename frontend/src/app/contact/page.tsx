// pages/contact.js
"use client";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-center mb-8">Contact Us</h1>

        {/* Company Details Section */}
        <div className="bg-white p-6 rounded-md shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Our Location & Contact Info
          </h2>
          <p className="text-gray-700 mb-2">
            <strong>Address:</strong> Kalkvegan X H0XX1, Green Market Place,
            Gjøvik 2818, Norway
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Phone:</strong>{" "}
            <a href="tel:+1234567890" className="text-blue-600 hover:underline">
              +47 40000001
            </a>
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong>{" "}
            <a
              href="mailto:support@shoplogo.com"
              className="text-blue-600 hover:underline"
            >
              support@gmp.com
            </a>
          </p>
          <p className="text-gray-700 mb-4">
            Our customer service team is available Monday to Friday, 8 AM to 3
            PM.
          </p>
          <iframe
            className="w-full h-64 border-0 rounded-md"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.082988372149!2d-122.4194154846812!3d37.77492917975906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f5f8d6cb%3A0x4a63f3f3c9c31d44!2s1234%20Market%20St%2C%20San%20Francisco%2C%20CA%2094114%2C%20USA!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
            loading="lazy"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full h-32"
                placeholder="Your Message"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
