"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoutUser } from "@/services/auth";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/products"
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
          >
            Admin Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/products/add"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              + Add Product
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}