import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getOrderById, updateOrderStatus } from "../../api/orderApi";
import { createReview } from "../../api/reviewApi";

const STATUS_STEPS = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || "Could not load this order.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000); // poll every 10s for live updates
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await updateOrderStatus(id, "CANCELLED");
      load();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
  e.preventDefault();
  if (rating < 1) {
    setReviewError('Please select a rating');
    return;
  }
  setSubmittingReview(true);
  setReviewError('');
  try {
    await createReview(id, rating, comment);
    load(); 
  } catch (err) {
    setReviewError(err.response?.data?.error?.message || 'Could not submit review.');
  } finally {
    setSubmittingReview(false);
  }
};

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">
        Loading...
      </div>
    );

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Link
            to="/orders"
            className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium inline-block"
          >
            ← Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const isTerminal = ["DELIVERED", "REJECTED", "CANCELLED"].includes(
    order.status,
  );
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const isCustomer = user?.id === order.customerId;

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/orders" className="text-white/50 hover:text-white text-sm">
            ← All Orders
          </Link>
          <Link to="/" className="text-white/50 hover:text-white text-sm">
            Home
          </Link>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Status timeline */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-5">
          {order.status === "REJECTED" || order.status === "CANCELLED" ? (
            <div className="text-center py-2">
              <p className="text-red-400 font-semibold mb-1">
                Order {order.status === "REJECTED" ? "Rejected" : "Cancelled"}
              </p>
              {order.rejectionReason && (
                <p className="text-white/50 text-sm">{order.rejectionReason}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i <= currentStepIndex
                        ? "bg-orange-500 text-white"
                        : "bg-white/10 text-white/30"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p
                    className={`text-[10px] mt-1 text-center ${i <= currentStepIndex ? "text-white/70" : "text-white/30"}`}
                  >
                    {step.replace(/_/g, " ")}
                  </p>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-full mt-4 -mb-4 ${i < currentStepIndex ? "bg-orange-500" : "bg-white/10"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-5">
          <p className="text-white font-semibold mb-3">
            {order.restaurant.name}
          </p>
          <div className="flex flex-col gap-2">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-white/60"
              >
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>RS.{Number(item.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-3 pt-3 flex justify-between text-white font-semibold">
            <span>Total</span>
            <span>RS.{Number(order.total).toFixed(2)}</span>
          </div>
          <p className="text-white/40 text-xs mt-2">
            Delivering to: {order.addressSnapshot}
          </p>
        </div>

        {isCustomer && order.status === "PENDING" && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full px-5 py-2.5 rounded-full bg-red-500/10 text-red-400 disabled:opacity-50 text-sm font-medium hover:bg-red-500/20"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {isCustomer && order.status === "DELIVERED" && !reviewSubmitted && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mt-5"
          >
            <p className="text-white font-medium mb-3">Rate your order</p>
            {reviewError && (
              <p className="text-red-400 text-sm mb-2">{reviewError}</p>
            )}
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-orange-400" : "text-white/20"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Optional comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 text-sm"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="mt-3 px-5 py-2 rounded-full bg-orange-500 disabled:opacity-50 text-white text-sm font-medium"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
        {reviewSubmitted && (
          <p className="text-green-400 text-sm mt-4 text-center">
            Thanks for your review!
          </p>
        )}

        {!isTerminal && (
          <p className="text-white/30 text-xs text-center mt-3">
            This page updates automatically every 10 seconds.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
