import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../api/orderApi';

const checkoutSchema = Yup.object({
  deliveryAddress: Yup.string().min(5, 'Address seems too short').required('Delivery address is required'),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, items, subtotal, emptyCartLocal } = useCart();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { deliveryAddress: user?.address || '' },
    validationSchema: checkoutSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const order = await createOrder(values.deliveryAddress);
        emptyCartLocal(); 
        navigate(`/orders/${order.id}`);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Could not place order. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-white/50">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium">
          Browse restaurants
        </button>
      </div>
    );
  }

  const total = subtotal + Number(cart.restaurant.deliveryFee);

  return (
    <div className="min-h-screen bg-[#0D0D0F] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-5">
          <p className="text-white font-semibold mb-3">{cart.restaurant.name}</p>
          <div className="flex flex-col gap-2 mb-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-white/60">
                <span>{item.quantity}× {item.menuItem.name}</span>
                <span>RS.{(Number(item.menuItem.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
            <div className="flex justify-between text-white/60 text-sm">
              <span>Subtotal</span>
              <span>RS.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/60 text-sm">
              <span>Delivery fee</span>
              <span>RS.{Number(cart.restaurant.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-lg mt-1">
              <span>Total</span>
              <span>RS.{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address form */}
        <form onSubmit={formik.handleSubmit} noValidate className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <label className="text-white/60 text-sm mb-2 block">Delivery address</label>
          <textarea
            name="deliveryAddress"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="Enter your full delivery address"
            value={formik.values.deliveryAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.deliveryAddress && formik.errors.deliveryAddress && (
            <p className="text-red-400 text-xs mt-1">{formik.errors.deliveryAddress}</p>
          )}

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-[0_0_20px_rgba(255,122,26,0.4)] transition-colors"
          >
            {formik.isSubmitting ? 'Placing order...' : `Place Order · RS.${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;