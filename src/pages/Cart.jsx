import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, items, subtotal, loading, refreshCart, updateQuantity, removeItem, emptyCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);

  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    await updateQuantity(cartItemId, newQty);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center text-white/50">Loading cart...</div>;
  }

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-white/50 text-lg">Your cart is empty.</p>
        <Link to="/" className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium">
          Browse restaurants
        </Link>
      </div>
    );
  }

  const belowMinimum = subtotal < Number(cart.restaurant.minimumOrder);
  const total = subtotal + Number(cart.restaurant.deliveryFee);

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Your Cart</h1>
          <button onClick={emptyCart} className="text-red-400 text-sm hover:text-red-300">
            Clear cart
          </button>
        </div>

        {/* Restaurant info */}
        <div className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          {cart.restaurant.logoUrl && (
            <img src={cart.restaurant.logoUrl} alt={cart.restaurant.name} className="w-12 h-12 rounded-xl object-cover" />
          )}
          <div>
            <p className="text-white font-semibold">{cart.restaurant.name}</p>
            {!cart.restaurant.isOpen && (
              <p className="text-red-400 text-xs">This restaurant is currently closed</p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              {item.menuItem.imageUrl ? (
                <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-white/10" />
              )}
              <div className="flex-1">
                <p className="text-white font-medium">{item.menuItem.name}</p>
                <p className="text-orange-400 text-sm">RS.{Number(item.menuItem.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                >
                  −
                </button>
                <span className="text-white w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 text-xs hover:text-red-300 ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex justify-between text-white/60 text-sm">
            <span>Subtotal</span>
            <span>RS.{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/60 text-sm">
            <span>Delivery fee</span>
            <span>RS.{Number(cart.restaurant.deliveryFee).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold text-lg border-t border-white/10 pt-2 mt-1">
            <span>Total</span>
            <span>RS.{total.toFixed(2)}</span>
          </div>

          {belowMinimum && (
            <p className="text-red-400 text-xs mt-1">
              Minimum order is RS.{Number(cart.restaurant.minimumOrder).toFixed(2)} — add RS.{(Number(cart.restaurant.minimumOrder) - subtotal).toFixed(2)} more to checkout.
            </p>
          )}

          <button
            disabled={belowMinimum || !cart.restaurant.isOpen}
            onClick={() => navigate('/checkout')}
            className="mt-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;