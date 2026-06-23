import { useState, useEffect, useCallback, useRef } from "react";
import DishCard from "../components/DishCard.jsx";
import Loading from "../components/Loading.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import useSocket from "../hooks/useSocket.js";
import { fetchAllDishes, toggleDishPublish, createNewDish } from "../api/dishApi.js";

const FILTERS = [
  { label: "All dishes", value: "all" },
  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" },
];

const Dashboard = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [togglingIds, setTogglingIds] = useState(new Set());
  
  // Add Dish State
  const [isAdding, setIsAdding] = useState(false);
  const [newDishName, setNewDishName] = useState("");
  const [newDishImage, setNewDishImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const loadDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllDishes();
      setDishes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  // ── Socket handler — real-time updates ─────────────────────────────────────
  const handleDishUpdated = useCallback((updatedDish) => {
    setDishes((prev) =>
      prev.map((d) =>
        d.dishId === updatedDish.dishId ? { ...d, ...updatedDish } : d
      )
    );
    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.delete(updatedDish.dishId);
      return next;
    });
  }, []);

  const handleDishAdded = useCallback((newDish) => {
    setDishes((prev) => {
      if (prev.some(d => d.dishId === newDish.dishId)) return prev;
      return [...prev, newDish];
    });
  }, []);

  const { isConnected } = useSocket("dishUpdated", handleDishUpdated);
  useSocket("dishAdded", handleDishAdded); // New socket listener

  // ── Toggle with optimistic update ─────────────────────────────────────────
  const handleToggle = useCallback(
    async (dishId) => {
      if (togglingIds.has(dishId)) return;

      setTogglingIds((prev) => new Set(prev).add(dishId));
      setDishes((prev) =>
        prev.map((d) =>
          d.dishId === dishId ? { ...d, isPublished: !d.isPublished } : d
        )
      );

      try {
        await toggleDishPublish(dishId);
      } catch (err) {
        setDishes((prev) =>
          prev.map((d) =>
            d.dishId === dishId ? { ...d, isPublished: !d.isPublished } : d
          )
        );
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(dishId);
          return next;
        });
        console.error("[Toggle] Failed:", err.message);
      }
    },
    [togglingIds]
  );

  // ── Add Dish Handlers ─────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDishImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishImage) return;

    setIsSaving(true);
    try {
      // Optimistic UI for adding is handled via the socket event "dishAdded" or by appending directly.
      // We will append directly to be safe, and let socket handle duplicates via the check in handleDishAdded.
      const addedDish = await createNewDish({
        dishName: newDishName,
        imageUrl: newDishImage
      });
      
      setDishes((prev) => {
        if (prev.some(d => d.dishId === addedDish.dishId)) return prev;
        return [...prev, addedDish];
      });

      setIsAdding(false);
      setNewDishName("");
      setNewDishImage("");
    } catch (err) {
      console.error("Failed to add dish", err);
      alert("Failed to add dish. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredDishes = dishes.filter((d) => {
    if (filter === "published") return d.isPublished;
    if (filter === "unpublished") return !d.isPublished;
    return true;
  });

  const publishedCount = dishes.filter((d) => d.isPublished).length;
  const unpublishedCount = dishes.filter((d) => !d.isPublished).length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="flex flex-col h-full w-full relative">
        {/* Hero banner */}
        <div className="relative bg-brand-600 text-white px-8 py-8 overflow-hidden shrink-0">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-500 rounded-full opacity-40" />
          <div className="absolute right-24 -bottom-8 w-32 h-32 bg-brand-400 rounded-full opacity-30" />
          <div className="absolute right-6 top-4 w-16 h-16 bg-brand-300 rounded-full opacity-20" />

          <div className="relative z-10 max-w-lg">
            <p className="text-brand-200 text-sm font-medium mb-1 uppercase tracking-wide">
              Dish Management
            </p>
            <h1 className="text-2xl font-bold leading-tight mb-2">
              Elevate Your Culinary<br />
              <span className="text-brand-200">Experience</span>
            </h1>
            <p className="text-brand-100 text-sm leading-relaxed max-w-sm">
              Manage your menu in real time. Toggle dish visibility instantly
              across all connected dashboards.
            </p>
          </div>

          {/* Live badge */}
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isConnected
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-red-500/80 text-white"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? "bg-white badge-live" : "bg-red-200"
                }`}
              />
              {isConnected ? "Live" : "Offline"}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex flex-wrap items-center gap-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 leading-none">{dishes.length}</p>
              <p className="text-xs text-gray-400">Total dishes</p>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden sm:block" />

          <div className="flex items-center gap-3 hidden sm:flex">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 leading-none">{publishedCount}</p>
              <p className="text-xs text-gray-400">Published</p>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden sm:block" />

          <div className="flex items-center gap-3 hidden sm:flex">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-red-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800 leading-none">{unpublishedCount}</p>
              <p className="text-xs text-gray-400">Unpublished</p>
            </div>
          </div>

          {/* Action & Filters */}
          <div className="ml-auto flex items-center gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-brand-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-brand-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Dish
            </button>
            <div className="w-px h-6 bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              {FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none ${
                    filter === value
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dishes grid */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <Loading count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={loadDishes} />
          ) : filteredDishes.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-4">
                Showing {filteredDishes.length} of {dishes.length} dishes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.dishId}
                    dish={dish}
                    onToggle={handleToggle}
                    isToggling={togglingIds.has(dish.dishId)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Add Dish Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Dish</h2>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              
              <form onSubmit={handleAddDish} className="space-y-6">
                {/* Photo Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Photo (Required)</label>
                  <div 
                    className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed ${newDishImage ? 'border-brand-300' : 'border-gray-300'} overflow-hidden relative group cursor-pointer hover:border-brand-500 bg-gray-50 flex items-center justify-center transition-colors`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {newDishImage ? (
                      <img src={newDishImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium">Click to upload photo</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium text-sm bg-black/40 px-3 py-1.5 rounded-full">
                        {newDishImage ? "Change Photo" : "Select Photo"}
                      </span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    required={!newDishImage}
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Name</label>
                  <input 
                    type="text" 
                    required
                    value={newDishName}
                    onChange={e => setNewDishName(e.target.value)}
                    placeholder="e.g. Truffle Mac & Cheese"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving || !newDishName || !newDishImage}
                    className="px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? "Publishing..." : "Publish Dish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </main>
  );
};

export default Dashboard;
