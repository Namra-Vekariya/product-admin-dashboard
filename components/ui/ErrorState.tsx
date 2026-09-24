interface ErrorStateProps {
    message?: string;
    onRetry: () => void;
  }
  
  export default function ErrorState({
    message = "Something went wrong.",
    onRetry,
  }: ErrorStateProps) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-sm mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }