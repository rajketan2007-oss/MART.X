import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWishlistApi, toggleWishlistApi, removeFromWishlistApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useUI();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      const stored = localStorage.getItem('extrad_guest_wishlist');
      if (stored) {
        try {
          setWishlistItems(JSON.parse(stored));
        } catch (e) {
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('extrad_guest_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetchWishlistApi();
      if (res.data && res.data.products) {
        setWishlistItems(res.data.products);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    const pId = product._id || product.id;
    const exists = wishlistItems.some(item => (item._id || item.id) === pId);

    if (user) {
      try {
        const res = await toggleWishlistApi(pId);
        setWishlistItems(res.data.wishlist.products || []);
        if (res.data.added) {
          addToast(`Added "${product.name}" to Wishlist!`, 'success');
        } else {
          addToast('Removed from Wishlist', 'info');
        }
      } catch (err) {
        addToast('Failed to update wishlist', 'error');
      }
    } else {
      if (exists) {
        setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== pId));
        addToast('Removed from Wishlist', 'info');
      } else {
        setWishlistItems(prev => [...prev, product]);
        addToast(`Added "${product.name}" to Wishlist!`, 'success');
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (user) {
      try {
        const res = await removeFromWishlistApi(productId);
        setWishlistItems(res.data.products || []);
        addToast('Removed from Wishlist', 'info');
      } catch (err) {
        addToast('Failed to remove item', 'error');
      }
    } else {
      setWishlistItems(prev => prev.filter(item => (item._id || item.id) !== productId));
      addToast('Removed from Wishlist', 'info');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
