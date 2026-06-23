/**
 * Displays an error message with a retry action.
 * @param {{ message: string, onRetry: Function }} props
 */
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
      <svg
        className="w-10 h-10 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">Something went wrong</h3>
    <p className="text-sm text-gray-400 max-w-xs mb-6">
      {message || "Unable to load dishes. Please try again."}
    </p>
    {typeof onRetry === "function" && (
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-1"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorState;
