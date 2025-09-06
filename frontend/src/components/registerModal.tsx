// components/RegisterModal.js
"use client";
import { useState } from "react";
import AUTH_APIs from "../handlers/apis/auth-apis";
import FILE_APIs from "../handlers/apis/file-apis";
import { toast } from "react-toastify";

export default function RegisterModal({ isOpen, onClose }: any) {
  const [formData, setFormData]: any = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    agreeToTerms: false,
    file: null,
  });

  const [errors, setErrors]: any = useState({});
  //moving it after hook diclaration.
  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const fileFormData = new FormData();
      fileFormData.append("file", formData["file"], formData["file"].name);
      const uploadFileResponse = await FILE_APIs.uploadFile(fileFormData);

      if (uploadFileResponse.status === 400) {
        // toast error
        toast.error(uploadFileResponse.data.error);
        return;
      }

      const registrationData: any = new FormData();

      registrationData.append("name", formData["name"]);
      registrationData.append("email", formData["email"]);
      registrationData.append("address", formData["address"]);
      registrationData.append("password", formData["password"]);
      registrationData.append("phone", formData["phone"]);
      registrationData.append("agreeToTerms", formData["agreeToTerms"]);
      registrationData.append(
        "avatar",
        JSON.stringify(uploadFileResponse.data.file)
      );

      const registerResponse = await AUTH_APIs.registerUser(registrationData);

      if (registerResponse.status === 200 || registerResponse.status === 201) {
        // registered successfully.
        toast.success("User registered successfully");
        onClose();
      } else {
        //print error.
        await FILE_APIs.deleteFile(registrationData["avatar"].filename);
        toast.error("Failed to register user.");
      }
    } catch (error: any) {
      toast.error(error.response.data.message, {
        position: "top-right",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            error={errors.name}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <InputField
            label="Address"
            name="address"
            type="text"
            value={formData.address}
            error={errors.address}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            error={errors.password}
            onChange={handleChange}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Avatar
            </label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="mt-1 w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              I agree to the Terms and Conditions
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function InputField({ label, name, type, value, error, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
