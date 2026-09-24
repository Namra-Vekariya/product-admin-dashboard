"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/services/products";
import { Product } from "@/types/product";
import Loader from "@/components/ui/Loader";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const productId = parseInt(id as string, 10);

    // Guard: invalid id format like /products/abc
    if (isNaN(productId) || productId <= 0) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    getProductById(productId)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.images?.[0] ?? data.thumbnail);
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <Loader />;

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-500">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <p className="text-lg font-medium text-gray-700 mb-2">
          Product not found
        </p>
        <p className="text-sm text-gray-400 mb-8">
          The product you are looking for does not exist.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === img
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">
                {product.category}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-blue-600">
              ${product.price}
            </p>

            {/* Rating + Stock */}
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-500 font-medium">
                <span>★</span>
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">/ 5</span>
              </span>
              <span
                className={`font-medium ${
                  product.stock < 10 ? "text-red-500" : "text-green-600"
                }`}
              >
                {product.stock < 10
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-1">
                Description
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews?.length > 0 && (
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Reviews ({product.reviews.length})
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {review.reviewerName}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500 text-sm">
                      {"★".repeat(review.rating)}
                      <span className="text-gray-400 ml-1">
                        {review.rating}/5
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}