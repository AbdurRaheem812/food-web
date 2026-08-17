import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { getRestaurantById } from "../api/restaurantApi";
import { getMenuItems } from "../api/menuApi";
import { getRestaurantReviews } from "../api/reviewApi";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { addItem, conflict, confirmReplaceCart, dismissConflict } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [reviewData, setReviewData] = useState({
    reviews: [],
    avgRating: null,
    reviewCount: 0,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [restaurantData, itemsData, reviewsData] = await Promise.all([
          getRestaurantById(id),
          getMenuItems(id),
          getRestaurantReviews(id),
        ]);
        setRestaurant(restaurantData);
        setItems(itemsData);
        setReviewData(reviewsData);
      } catch (err) {
        setError(
          err.response?.data?.error?.message ||
            "Could not load this restaurant.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async (itemId) => {
    setAddingId(itemId);
    const result = await addItem(itemId, 1);
    setAddingId(null);
    if (!result.success && !result.conflict) {
      alert(result.message);
    }
  };

  const RestaurantDetailSkeleton = () => (
    <div className="min-h-screen bg-[#0D0D0F] pb-16 animate-pulse">
      <div className="relative">
        <div className="h-48 bg-white/5" />
        <div className="max-w-4xl mx-auto px-4 -mt-20 relative">
          <div className="flex items-end gap-5">
            <div className="w-28 h-28 rounded-2xl bg-white/10 border-4 border-[#0D0D0F]" />
            <div className="pb-2">
              <div className="h-7 w-48 bg-white/10 rounded mb-2" />
              <div className="h-4 w-32 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-4 w-full max-w-md bg-white/10 rounded mt-4" />
          <div className="flex gap-6 mt-4">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="h-6 w-32 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4"
            >
              <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-1/2 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <RestaurantDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            to="/"
            className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium inline-block"
          >
            ← Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  // Group items by category name; items with no category go under "Other"
  const grouped = items.reduce((acc, item) => {
    const key = item.category?.name || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0D0D0F] pb-16">
      {/* Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-b from-orange-900/30 to-[#0D0D0F]" />
        <div className="max-w-4xl mx-auto px-4 -mt-20 relative">
          <div className="flex items-end gap-5">
            {restaurant.logoUrl ? (
              <img
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-[#0D0D0F] shadow-2xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-white/10 border-4 border-[#0D0D0F]" />
            )}
            <div className="pb-2">
              <h1 className="text-3xl font-bold text-white">
                {restaurant.name}
              </h1>
              <p className="text-white/50 text-sm">
                {restaurant.restaurantCuisines
                  ?.map((rc) => rc.cuisine.name)
                  .join(", ") || "No cuisines listed"}
              </p>
            </div>
          </div>
          {reviewData.avgRating && (
            <p className="text-orange-400 text-sm mt-1">
              ★ {reviewData.avgRating} ({reviewData.reviewCount} review
              {reviewData.reviewCount !== 1 ? "s" : ""})
            </p>
          )}

          {!restaurant.isOpen && (
            <div className="mt-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm inline-block">
              Currently closed
            </div>
          )}

          {restaurant.description && (
            <p className="text-white/60 mt-4">{restaurant.description}</p>
          )}

          <div className="flex gap-6 mt-4 text-sm text-white/50">
            <span>📍 {restaurant.address}</span>
            <span>
              🚴 RS.{Number(restaurant.deliveryFee).toFixed(2)} delivery
            </span>
            <span>
              🛒 RS.{Number(restaurant.minimumOrder).toFixed(2)} minimum
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-4 mt-10">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-white/40">
            This restaurant hasn't added any menu items yet.
          </p>
        ) : (
          Object.entries(grouped).map(([categoryName, categoryItems]) => (
            <div key={categoryName} className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                {categoryName}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4 ${
                      !item.isAvailable ? "opacity-40" : ""
                    }`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.name}{" "}
                        {item.isVeg && (
                          <span className="text-green-400 text-xs">🌱</span>
                        )}
                      </p>
                      {item.description && (
                        <p className="text-white/40 text-xs mt-0.5">
                          {item.description}
                        </p>
                      )}
                      <p className="text-orange-400 text-sm mt-1">
                        RS.{Number(item.price).toFixed(2)}
                      </p>
                      {!item.isAvailable && (
                        <p className="text-white/40 text-xs mt-1">
                          Currently unavailable
                        </p>
                      )}
                      {user?.roles?.includes("CUSTOMER") &&
                        item.isAvailable && (
                          <button
                            onClick={() => handleAddToCart(item.id)}
                            disabled={addingId === item.id}
                            className="mt-2 px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-xs font-medium"
                          >
                            {addingId === item.id ? "Adding..." : "Add to Cart"}
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {reviewData.reviews.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
          <div className="flex flex-col gap-3">
            {reviewData.reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-medium text-sm">
                    {r.customer.username}
                  </span>
                  <span className="text-orange-400 text-sm">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-white/60 text-sm">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {conflict && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-[#151517] border border-white/10 rounded-2xl p-6 max-w-sm text-center">
            <p className="text-white mb-4">
              Your cart has items from a different restaurant. Clear it and
              start a new order here?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={dismissConflict}
                className="px-4 py-2 rounded-full bg-white/10 text-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplaceCart}
                className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm"
              >
                Clear & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
