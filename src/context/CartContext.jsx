import { createContext, useState, useCallback } from "react";
import * as cartApi from "../api/cartApi";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState(null);

  const applyResult = (result) => {
    setCart(result.cart);
    setItems(result.items);
    setSubtotal(result.subtotal);
  };

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await cartApi.getCart();
      applyResult(result);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addItem = async (menuItemId, quantity = 1, replaceCart = false) => {
    try {
      const result = await cartApi.addToCart(menuItemId, quantity, replaceCart);
      applyResult(result);
      setConflict(null);
      return { success: true };
    } catch (err) {
      if (err.response?.status === 409) {
        setConflict({ menuItemId, quantity });
        return {
          success: false,
          conflict: true,
          message: err.response.data.error.message,
        };
      }
      return {
        success: false,
        message: err.response?.data?.error?.message || "Could not add item.",
      };
    }
  };

  const confirmReplaceCart = async () => {
    if (!conflict) return;
    await addItem(conflict.menuItemId, conflict.quantity, true);
  };

  const updateQuantity = async (cartItemId, quantity) => {
    const result = await cartApi.updateCartItem(cartItemId, quantity);
    applyResult(result);
  };

  const removeItem = async (cartItemId) => {
    const result = await cartApi.removeCartItem(cartItemId);
    applyResult(result);
  };

  const emptyCart = async () => {
    await cartApi.clearCart();
    setCart(null);
    setItems([]);
    setSubtotal(0);
  };

  const emptyCartLocal = () => {
  setCart(null);
  setItems([]);
  setSubtotal(0);
};

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        subtotal,
        itemCount,
        loading,
        conflict,
        refreshCart,
        addItem,
        updateQuantity,
        removeItem,
        emptyCart,
        emptyCartLocal,
        confirmReplaceCart,
        dismissConflict: () => setConflict(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
