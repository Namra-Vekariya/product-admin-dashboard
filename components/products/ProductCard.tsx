import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover rounded-lg"
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">
          {product.category}
        </span>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          <span>${product.price}</span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            {product.rating}
          </span>
          <span
            className={`font-medium ${
              product.stock < 10 ? "text-red-500" : "text-green-600"
            }`}
          >
            Stock: {product.stock}
          </span>
        </div>
        <div className="mt-3 flex gap-3">
          <Link
            href={`/products/${product.id}`}
            className="text-blue-600 hover:underline text-xs"
          >
            View
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className="text-gray-600 hover:underline text-xs"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-500 hover:underline text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}