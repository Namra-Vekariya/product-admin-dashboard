import type { Category } from "@/types/category";

interface FiltersProps {
  categories: Category[];
  selectedCategory: string;
  sortBy: string;
  order: string;
  hasActiveSearch: boolean;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onOrderChange: (value: string) => void;
}

export default function Filters({
  categories,
  selectedCategory,
  sortBy,
  order,
  hasActiveSearch,
  onCategoryChange,
  onSortByChange,
  onOrderChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Category filter — disabled when search is active */}
      <div className="relative group">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={hasActiveSearch}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition appearance-none pr-8"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        {hasActiveSearch && (
          <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Clear search to filter by category
          </span>
        )}
      </div>

      {/* Sort by */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
      >
        <option value="">Sort by</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="title">Title</option>
      </select>

      {/* Order */}
      <select
        value={order}
        onChange={(e) => onOrderChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}