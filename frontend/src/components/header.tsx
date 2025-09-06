"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { logout } from "../handlers/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SignInModal from "./signinModal";
import RegisterModal from "./registerModal";
import WHITE_LOGO_IMAGE from "@/public/images/gmp-white.png";
import WHITE_LOGO_IMAGE_SHORT from "@/public/images/gmp-logo-white.png";
import "../styles/header.css";
import { useAppDispatch, useAppSelector } from "../handlers/redux/hooks";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Track if component has mounted
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state: any) => state.auth.user);
  const cart = useAppSelector((state: any) => state.carts.cart); // Get cart from redux state
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    setMounted(true);

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setDropdownOpen(false);
    }
  }, [user]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearchTerm("");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/"); // Redirect to the home page after logout
  };

  if (!mounted) return null; // Avoid rendering mismatched HTML on the server

  function handleToggleDropDown(): void {
    setDropdownOpen(!isDropdownOpen);
  }

  return (
    <header className="bg-green-600 shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="lg:block hidden text-2xl font-bold text-white"
        >
          <Image
            src={WHITE_LOGO_IMAGE}
            alt="GMP"
            width={150}
            height={150}
            priority
          />
        </Link>
        <Link
          href="/"
          className="lg:hidden block text-2xl font-bold text-white"
        >
          <Image
            src={WHITE_LOGO_IMAGE_SHORT}
            alt="GMP"
            width={80}
            height={80}
            priority
          />
        </Link>

        {/* Navigation for large screens */}
        <nav className={`md:flex space-x-6 hidden md:block`}>
          <Link
            href="/sustainability"
            className="hover:text-gray-800 text-white"
          >
            Sustainability
          </Link>
          <Link href="/about" className="hover:text-gray-800 text-white">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-800 text-white">
            Contact
          </Link>
        </nav>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center relative w-30 lg:w-96 md:w-90 sm:w-60"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="px-4 py-2 rounded-lg outline-none w-30 lg:w-96 md:w-90 sm:w-60"
          />
          <button type="submit" className="absolute right-2 top-2">
            <Image
              src="/images/search.png"
              alt="Search"
              width={20}
              height={20}
            />
          </button>
        </form>

        {/* User and Cart Icons */}
        <div className="flex space-x-4 items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleToggleDropDown}
                className="flex items-center space-x-2 text-white focus:outline-none"
              >
                <span className="flex items-center space-x-2">
                  <Image
                    src={
                      user?.avatar?.avatarUrl || "/images/default-avatar.png"
                    }
                    alt={`${user.name}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="hover:text-gray-200 sm:text-lg text-sm">{`Hello, ${user.name}`}</span>
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    href="/sustainability"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 block md:hidden"
                  >
                    Sustainability
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 block md:hidden"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 block md:hidden"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => setSignInOpen(true)}
                className="hover:text-gray-200 text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => setRegisterOpen(true)}
                className="hover:text-gray-200 text-white"
              >
                Register
              </button>
            </div>
          )}

          {/* Cart Icon with Badge */}
          <Link
            href="/cart"
            className="relative hover:text-gray-200 text-white"
          >
            <Image src="/images/cart.png" alt="Cart" width={40} height={40} />
            {cart?.totalQuantity > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart?.totalQuantity}
              </div>
            )}
          </Link>
        </div>
      </div>
      {/* Modals */}
      <SignInModal isOpen={isSignInOpen} onClose={() => setSignInOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </header>
  );
}
