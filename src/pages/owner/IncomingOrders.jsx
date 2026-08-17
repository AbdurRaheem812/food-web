import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getRestaurantOrders,
  updateOrderStatus,
  getAllOwnerOrders,
} from "../../api/orderApi";

const NEXT_ACTIONS = {
  PENDING: [
    { label: "Accept", status: "ACCEPTED" },
    { label: "Reject", status: "REJECTED", needsReason: true },
  ],
  ACCEPTED: [{ label: "Start Preparing", status: "PREPARING" }],
  PREPARING: [{ label: "Out for Delivery", status: "OUT_FOR_DELIVERY" }],
  OUT_FOR_DELIVERY: [{ label: "Mark Delivered", status: "DELIVERED" }],
};

const IncomingOrders = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      const data = restaurantId
        ? await getRestaurantOrders(restaurantId)
        : await getAllOwnerOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [restaurantId]);
  const handleAction = async (orderId, status, needsReason) => {
    let reason;
    if (needsReason) {
      reason = window.prompt("Reason for rejecting this order:");
      if (!reason) return;
    }
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status, reason);
      load();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );

  const activeOrders = orders.filter(
    (o) => !["DELIVERED", "REJECTED", "CANCELLED"].includes(o.status),
  );
  const pastOrders = orders.filter((o) =>
    ["DELIVERED", "REJECTED", "CANCELLED"].includes(o.status),
  );

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Incoming Orders</h1>
          <Link
            to={restaurantId ? "/owner/restaurants" : "/profile"}
            className="text-white/50 hover:text-white text-sm"
          >
            ← Back
          </Link>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <h2 className="text-white/60 text-sm font-medium mb-2">Active</h2>
        {activeOrders.length === 0 && (
          <p className="text-white/30 text-sm mb-6">No active orders.</p>
        )}
        <div className="flex flex-col gap-3 mb-8">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-medium">
                    {order.customer.username}
                  </p>
                  <p className="text-white/40 text-xs">
                    {order.customer.phoneNumber}
                  </p>
                  {!restaurantId && (
                    <p className="text-orange-400 text-xs mt-0.5">
                      {order.restaurant.name}
                    </p>
                  )}
                </div>
                <span className="text-orange-400 text-xs font-medium">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-white/50 text-xs mb-3">
                {order.orderItems
                  .map((i) => `${i.quantity}× ${i.name}`)
                  .join(", ")}{" "}
                · RS.{Number(order.total).toFixed(2)}
              </div>
              <div className="flex gap-2">
                {(NEXT_ACTIONS[order.status] || []).map((action) => (
                  <button
                    key={action.status}
                    onClick={() =>
                      handleAction(order.id, action.status, action.needsReason)
                    }
                    disabled={updatingId === order.id}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium disabled:opacity-50 ${
                      action.status === "REJECTED"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-white/60 text-sm font-medium mb-2">Past</h2>
        <div className="flex flex-col gap-2">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between text-sm"
            >
              <span className="text-white/60">
                {order.customer.username} · RS.{Number(order.total).toFixed(2)}
              </span>
              <span className="text-white/40">
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncomingOrders;
