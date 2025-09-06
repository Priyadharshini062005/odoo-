/**
 * @description: This file contains the main layout of the app. This layout will be part of every page.
 *               To make a redux store work, it is necessary to wrap other layouts in this main layout.
 */
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import StoreProvider from "./StoreProvider";
import Header from "../components/header";
import Footer from "../components/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const openSans = localFont({
  src: "./fonts/OpenSans.ttf",
  variable: "--font-open-sans",
  weight: "100 900",
});

const openSansItalic = localFont({
  src: "./fonts/OpenSans-Italic.ttf",
  variable: "--font-open-sans-italic",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "green-market-place",
  description:
    "This application is created in the Specialization in Web Technology project.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${openSansItalic.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <StoreProvider>
          
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
          />
          
          <Header />
          
          {children}
          
          <Footer />
          
        </StoreProvider>
      </body>
    </html>
  );
}
