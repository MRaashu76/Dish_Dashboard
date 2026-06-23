/**
 * DishCard — displays a single dish with its image, name, published status,
 * and a toggle button. Implements optimistic UI feedback.
 *
 * @param {{ dish: Object, onToggle: Function, isToggling: boolean }} props
 */
const DishCard = ({ dish, onToggle, isToggling }) => {
  const { dishId, dishName, imageUrl, isPublished } = dish;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={imageUrl}
          alt={dishName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
          }}
        />

        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          {isPublished ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white badge-live" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70" />
              Unpublished
            </span>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Dish #{dishId}</p>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1">
              {dishName}
            </h3>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => onToggle(dishId)}
          disabled={isToggling}
          className={`w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            isPublished
              ? "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-300 border border-red-100"
              : "bg-brand-50 text-brand-700 hover:bg-brand-100 focus:ring-brand-300 border border-brand-100"
          }`}
          aria-label={
            isPublished
              ? `Unpublish ${dishName}`
              : `Publish ${dishName}`
          }
        >
          {isToggling ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Updating…
            </span>
          ) : isPublished ? (
            "Unpublish dish"
          ) : (
            "Publish dish"
          )}
        </button>
      </div>
    </div>
  );
};

export default DishCard;
