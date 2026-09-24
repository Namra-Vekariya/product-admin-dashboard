import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="48px"
                  />
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                {product.title}
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs capitalize">
                  {product.category}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">${product.price}</td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {product.rating}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`font-medium ${
                    product.stock < 10 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}