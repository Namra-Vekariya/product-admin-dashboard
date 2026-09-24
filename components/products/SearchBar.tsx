interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    hasActiveCategory: boolean;
  }
  
  export default function SearchBar({
    value,
    onChange,
    hasActiveCategory,
  }: SearchBarProps) {
    return (
      <div className="relative w-full max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            hasActiveCategory
              ? "Clear category to search..."
              : "Search products..."
          }
          disabled={hasActiveCategory}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
        />
      </div>
    );
  }