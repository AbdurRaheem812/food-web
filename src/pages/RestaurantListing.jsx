import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { getPublicRestaurants } from "../api/restaurantApi";

const CUISINE_OPTIONS = [
  "Pakistani",
  "Chinese",
  "Italian",
  "Fast Food",
  "BBQ",
  "Desserts",
];

const RestaurantListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 400);

  const [restaurants, setRestaurants] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cuisine = searchParams.get("cuisine") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;

  // Sync debounced search text into the URL (resets to page 1 on a new search)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  // Fetch whenever any real query param changes
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPublicRestaurants({
          search: searchParams.get("search") || undefined,
          cuisine: cuisine || undefined,
          sort,
          page,
          limit: 9,
        });
        setRestaurants(data.restaurants);
        setMeta(data.meta);
      } catch (err) {
        setError(
          err.response?.data?.error?.message || "Could not load restaurants.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [searchParams.get("search"), cuisine, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Good Food, <span className="text-orange-500">Good Mood</span>
        </h1>
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <select
            value={cuisine}
            onChange={(e) => updateParam("cuisine", e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="" style={{ background: "#1a1a1a" }}>
              All cuisines
            </option>
            {CUISINE_OPTIONS.map((c) => (
              <option key={c} value={c} style={{ background: "#1a1a1a" }}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="newest" style={{ background: "#1a1a1a" }}>
              Newest
            </option>
            <option value="name" style={{ background: "#1a1a1a" }}>
              Name (A-Z)
            </option>
            <option value="deliveryFee" style={{ background: "#1a1a1a" }}>
              Lowest delivery fee
            </option>
          </select>
        </div>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse"
              >
                <div className="w-full h-32 rounded-xl bg-white/10 mb-3" />
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {restaurants.map((r) => (
              <Link
                key={r.id}
                to={`/restaurants/${r.id}`}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-orange-500/50 transition-colors"
              >
                {r.logoUrl ? (
                  <img
                    src={r.logoUrl}
                    alt={r.name}
                    className="w-full h-32 object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div className="w-full h-32 rounded-xl bg-white/10 mb-3" />
                )}
                <p className="text-white font-semibold">{r.name}</p>
                <p className="text-white/50 text-sm mb-2">
                  {r.restaurantCuisines
                    ?.map((rc) => rc.cuisine.name)
                    .join(", ") || "No cuisines listed"}
                </p>
                <p className="text-orange-400 text-sm">
                  Delivery: ${Number(r.deliveryFee).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-white/60 text-sm px-3">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => goToPage(page + 1)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListing;
