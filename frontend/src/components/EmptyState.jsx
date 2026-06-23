/**
 * Displays a friendly empty state when there are no dishes to show.
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-5">
      <svg
        className="w-10 h-10 text-brand-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">No dishes found</h3>
    <p className="text-sm text-gray-400 max-w-xs">
      Your menu is empty. Add some dishes to get started.
    </p>
  </div>
);

export default EmptyState;
