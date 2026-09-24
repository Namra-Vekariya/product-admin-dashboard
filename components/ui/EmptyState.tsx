interface EmptyStateProps {
    message?: string;
  }
  
  export default function EmptyState({
    message = "No products found.",
  }: EmptyStateProps) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg
          className="w-12 h-12 mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
        <p className="text-sm">{message}</p>
      </div>
    );
  }