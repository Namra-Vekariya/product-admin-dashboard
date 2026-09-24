"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import type { Category } from "@/types/category";
import { Product, ProductsResponse } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/products/Pagination";
import ProductCard from "@/components/products/ProductCard";
import ProductTable from "@/components/products/ProductTable";
import Loader from "@/components/ui/Loader";
import Filters from "@/components/products/Filters";
import SearchBar from "@/components/products/SearchBar";

// Safe integer parser — returns fallback for invalid values
function safeInt(value: string | null, fallback: number, min = 1): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < min) return fallback;
  return parsed;
}

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state from URL — single source of truth
  const currentPage = safeInt(searchParams.get("page"), 1);
  const pageSize = (() => {
    const size = safeInt(searchParams.get("limit"), 10);
    return [10, 20, 50].includes(size) ? size : 10;
  })();
  const searchQuery = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const order = searchParams.get("order") ?? "asc";

  // Local state
  const [inputValue, setInputValue] = useState(searchQuery);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(inputValue, 400);

  // Update URL params helper
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // When debounced search changes → update URL and reset to page 1
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("q", debouncedSearch);
        params.delete("category"); // clear category when searching
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch]);

  // Fetch products whenever URL params change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * pageSize;
      const result = await getProducts({
        limit: pageSize,
        skip,
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        sortBy: (sortBy as "price" | "rating" | "title") || undefined,
        order: (order as "asc" | "desc") || undefined,
      });

      // Guard: if page is beyond total, go to last valid page
      const totalPages = Math.ceil(result.total / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        updateParams({ page: String(totalPages) });
        return;
      }

      setData(result);
    } catch (err: unknown) {
      // Ignore abort errors — they are intentional from race condition fix
      if (err && typeof err === "object" && "code" in err) {
        if ((err as { code: string }).code === "ERR_CANCELED") return;
      }
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedCategory, sortBy, order]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch categories once on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {}); // non-critical — filters just won't show
  }, []);

  // Delete handler — optimistic UI update
  const handleDelete = (id: number) => {
    if (!data) return;
    // We use optimistic update: remove from local state immediately
    // The API call is handled in Chunk 6 (Add/Edit/Delete)
    setData((prev) =>
      prev
        ? {
            ...prev,
            products: prev.products.filter((p) => p.id !== id),
            total: prev.total - 1,
          }
        : prev
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {data && (
          <p className="text-sm text-gray-500">
            {data.total} total products
          </p>
        )}
      </div>

      {/* Search + Filters row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={inputValue}
          onChange={setInputValue}
          hasActiveCategory={!!selectedCategory}
        />
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          order={order}
          hasActiveSearch={!!searchQuery}
          onCategoryChange={(val) =>
            updateParams({ category: val, page: "1" })
          }
          onSortByChange={(val) => updateParams({ sortBy: val, page: "1" })}
          onOrderChange={(val) => updateParams({ order: val })}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : !data || data.products.length === 0 ? (
        <EmptyState message="No products found. Try a different search or filter." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <ProductTable products={data.products} onDelete={handleDelete} />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {data.products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={data.total}
            pageSize={pageSize}
            onPageChange={(page) => updateParams({ page: String(page) })}
            onPageSizeChange={(size) =>
              updateParams({ limit: String(size), page: "1" })
            }
          />
        </>
      )}
    </div>
  );
}