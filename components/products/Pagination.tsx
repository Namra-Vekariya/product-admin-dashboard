interface PaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  }
  
  export default function Pagination({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
  }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
  
    // Build page numbers to show — always show first, last, current ±1
    const getPageNumbers = (): (number | "...")[] => {
      const pages: (number | "...")[] = [];
      const delta = 1;
  
      const range: number[] = [];
      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }
  
      pages.push(1);
      if (range[0] > 2) pages.push("...");
      pages.push(...range);
      if (range[range.length - 1] < totalPages - 1) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
  
      return pages;
    };
  
    if (totalItems === 0) return null;
  
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        {/* Showing X-Y of Z */}
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium">{start}</span>–
          <span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{totalItems}</span>
        </p>
  
        <div className="flex items-center gap-3">
          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
  
          {/* Prev / page numbers / Next */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
  
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`w-9 h-9 text-sm rounded-lg border transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              )
            )}
  
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }