import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";

const STATUS_COLORS = {
  PENDING: "text-yellow-400 bg-yellow-500/10",
  ACCEPTED: "text-blue-400 bg-blue-500/10",
  PREPARING: "text-orange-400 bg-orange-500/10",
  OUT_FOR_DELIVERY: "text-purple-400 bg-purple-500/10",
  DELIVERED: "text-green-400 bg-green-500/10",
  REJECTED: "text-red-400 bg-red-500/10",
  CANCELLED: "text-white/40 bg-white/5",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(
          err.response?.data?.error?.message || "Could not load orders.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>
        <Link
          to={"/profile"}
          className="text-white/50 hover:text-white text-sm"
          style={{ marginLeft: "545px" }}
        >
          ← Back
        </Link>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 && !error && (
          <p className="text-white/40">You haven't placed any orders yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-orange-500/50 transition-colors"
            >
              {order.restaurant.logoUrl && (
                <img
                  src={order.restaurant.logoUrl}
                  alt={order.restaurant.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-white font-medium">
                  {order.restaurant.name}
                </p>
                <p className="text-white/40 text-xs">
                  {order.orderItems.length} item(s) · RS.
                  {Number(order.total).toFixed(2)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
