import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCartApi, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi, validateCouponApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useUI();

  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync cart whenever user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Local storage fallback for unauthenticated users
      const localCart = localStorage.getItem('extrad_guest_cart');
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [user]);

  // Persist guest cart
  useEffect(() => {
    if (!user) {
      localStorage.setItem('extrad_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await fetchCartApi();
      if (res.data && res.data.items) {
        setCartItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size = 'M', color = '') => {
    if (user) {
      try {
        const res = await addToCartApi({
          productId: product._id || product.id,
          quantity,
          size: size || (product.sizes && product.sizes[0]) || 'M',
          color: color || (product.colors && product.colors[0]) || ''
        });
        setCartItems(res.data.items);
        addToast(`Added "${product.name}" to Bag!`, 'success');
      } catch (err) {
        addToast('Failed to add item to bag', 'error');
      }
    } else {
      // Guest cart addition
      const pId = product._id || product.id;
      const selectedSize = size || (product.sizes && product.sizes[0]) || 'M';
      const existingIdx = cartItems.findIndex(item => item.product._id === pId && item.size === selectedSize);

      let updated = [...cartItems];
      if (existingIdx > -1) {
        updated[existingIdx].quantity += quantity;
      } else {
        updated.push({
          _id: `guest_${Date.now()}`,
          product,
          quantity,
          size: selectedSize,
          color: color || (product.colors && product.colors[0]) || ''
        });
      }
      setCartItems(updated);
      addToast(`Added "${product.name}" to Bag!`, 'success');
    }
  };

  const updateQuantity = async (itemId, quantity, size, color) => {
    if (user) {
      try {
        const res = await updateCartItemApi(itemId, { quantity, size, color });
        setCartItems(res.data.items);
      } catch (err) {
        addToast('Failed to update quantity', 'error');
      }
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item._id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const res = await removeFromCartApi(itemId);
        setCartItems(res.data.items);
        addToast('Item removed from Bag', 'info');
      } catch (err) {
        addToast('Failed to remove item', 'error');
      }
    } else {
      setCartItems(prev => prev.filter(item => item._id !== itemId));
      addToast('Item removed from Bag', 'info');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await clearCartApi();
      } catch (err) {
        console.error(err);
      }
    }
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    const rawMrpSubtotal = cartItems.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    );

    try {
      const res = await validateCouponApi({ code, orderAmount: rawMrpSubtotal });
      if (res.data && res.data.valid) {
        setCoupon(res.data);
        addToast(`Coupon "${res.data.code}" applied! Saved ₹${res.data.discountAmount}`, 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Pricing calculations
  const totalMRP = cartItems.reduce(
    (acc, item) => acc + (item.product?.mrp || item.product?.price || 0) * item.quantity,
    0
  );
  const totalSellingPrice = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const productDiscount = totalMRP - totalSellingPrice;
  const couponDiscount = coupon ? coupon.discountAmount : 0;
  const deliveryFee = totalSellingPrice > 999 || cartItems.length === 0 ? 0 : 99;
  const finalAmount = Math.max(0, totalSellingPrice - couponDiscount + deliveryFee);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        coupon,
        totalMRP,
        totalSellingPrice,
        productDiscount,
        couponDiscount,
        deliveryFee,
        finalAmount,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
