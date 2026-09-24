'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import api, { getToken } from '../lib/api';

const CartWishlistContext = createContext();

const getResponseData = (response) => response?.data?.data ?? response?.data ?? response;

export const CartWishlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // কার্ট এবং উইশলিস্ট ফেচ করা
  useEffect(() => {
    if (authLoading) return;

    const fetchCartAndWishlist = async () => {
      try {
        const token = getToken();
        
        if (user && token) {
          // Move guest items to the authenticated user's database record.
          if (typeof window !== 'undefined') {
            const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
            const guestWishlist = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');

            try {
              await Promise.all(guestCart.map((item) => {
                const productId = item.product?._id || item.product?.id || item._id;
                return productId ? api.post('/cart', { productId, quantity: item.quantity || 1 }) : null;
              }));
              localStorage.removeItem('guest_cart');
            } catch (e) {
              console.error('Guest cart migration failed:', e);
            }

            try {
              await Promise.all(guestWishlist.map((item) => {
                const productId = item.product?._id || item.product?.id || item._id;
                return productId ? api.post('/wishlist', { productId }) : null;
              }));
              localStorage.removeItem('guest_wishlist');
            } catch (e) {
              console.error('Guest wishlist migration failed:', e);
            }
          }

          // 🛒 Cart Fetch (সঠিক পাথ: /cart)
          try {
            const cartRes = await api.get('/cart');
            const cartData = getResponseData(cartRes);
            setCart(Array.isArray(cartData) ? cartData : []);
          } catch (e) {
            console.error('Cart fetch failed:', e);
          }

          // ❤️ Wishlist Fetch (সঠিক পাথ: /wishlist)
          try {
            const wishRes = await api.get('/wishlist');
            const wishData = getResponseData(wishRes);
            setWishlist(Array.isArray(wishData) ? wishData : []);
          } catch (e) {
            console.error('Wishlist fetch failed:', e);
          }
          
        } else {
          // গেস্ট মোড হলে LocalStorage থেকে লোড করা
          if (typeof window !== 'undefined') {
            const localCart = localStorage.getItem('guest_cart');
            const localWish = localStorage.getItem('guest_wishlist');
            if (localCart) {
              try {
                setCart(JSON.parse(localCart));
              } catch (e) {
                localStorage.removeItem('guest_cart');
              }
            }
            if (localWish) {
              try {
                setWishlist(JSON.parse(localWish));
              } catch (e) {
                localStorage.removeItem('guest_wishlist');
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch cart/wishlist', err);
      } finally {
        setHydrated(true);
        setLoading(false);
      }
    };

    fetchCartAndWishlist();
  }, [user, authLoading]);

  // গেস্ট হলে LocalStorage-এ সিভ করা
  useEffect(() => {
    const token = getToken();
    if (hydrated && (!user || !token) && typeof window !== 'undefined') {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
      localStorage.setItem('guest_wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, user, hydrated]);

  // 🛒 Add to Cart ফাংশন
  const addToCart = async (product, quantity = 1) => {
    const productId = product._id || product.id;
    const token = getToken();
    
    if (user && token) {
      try {
        const res = await api.post('/cart', { productId, quantity });
        const cartData = getResponseData(res);
        if (Array.isArray(cartData)) {
          setCart(cartData);
          // Backend স্বয়ংক্রিয়ভাবে quantity বাড়াবে যদি product আগে থাকে
          const existingItem = cart.find(
            item => (item.product?._id || item.product?.id || item._id) === productId
          );
          toast.success(existingItem ? 'Cart quantity updated' : 'Added to cart');
        }
      } catch (err) {
        console.error('Add to cart failed:', err);
        toast.error('Failed to add to cart');
      }
    } else {
      // Guest mode - one product can only exist once until explicitly removed.
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          item => (item.product?._id || item.product?.id || item._id) === productId
        );
        if (existingIndex > -1) {
          return prevCart;
        } else {
          return [...prevCart, { product, quantity }];
        }
      });
      const existingItem = cart.find(
        item => (item.product?._id || item.product?.id || item._id) === productId
      );
      toast.success(existingItem ? 'Already in cart' : 'Added to cart');
    }
  };

  const removeFromCart = async (productId) => {
    const token = getToken();
    if (user && token) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        const cartData = getResponseData(res);
        if (Array.isArray(cartData)) setCart(cartData);
      } catch (err) {
        console.error('Remove from cart failed:', err);
        toast.error('Failed to remove from cart');
      }
      return;
    }

    setCart((prevCart) => prevCart.filter(
      item => (item.product?._id || item.product?.id || item._id) !== productId
    ));
  };

  const updateCartQuantity = async (productId, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity));
    const token = getToken();

    if (user && token) {
      try {
        const res = await api.patch(`/cart/${productId}`, { quantity: nextQuantity });
        const cartData = getResponseData(res);
        if (Array.isArray(cartData)) setCart(cartData);
      } catch (err) {
        console.error('Cart quantity update failed:', err);
        toast.error('Failed to update cart');
      }
      return;
    }

    setCart((prevCart) => prevCart.map((item) => {
      const itemId = item.product?._id || item.product?.id || item._id;
      return itemId === productId ? { ...item, quantity: nextQuantity } : item;
    }));
  };

  const clearCart = async () => {
    const token = getToken();
    if (user && token) {
      await Promise.all(cart.map((item) => {
        const productId = item.product?._id || item.product?.id || item._id;
        return productId ? api.delete(`/cart/${productId}`) : null;
      }));
    }
    setCart([]);
    if (typeof window !== 'undefined') localStorage.removeItem('guest_cart');
  };

  // ❤️ Toggle Wishlist ফাংশন
  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    const token = getToken();
    
    if (user && token) {
      // Check if product exists in wishlist before API call
      const existsBefore = wishlist.some(
        item => (item.product?._id || item.product?.id || item._id) === productId
      );
      
      try {
        const res = await api.post('/wishlist', { productId });
        const wishData = getResponseData(res);
        if (Array.isArray(wishData)) {
          setWishlist(wishData);
          // Check if product exists in wishlist after API call
          const existsAfter = wishData.some(
            item => (item.product?._id || item.product?.id || item._id) === productId
          );
          toast.success(existsBefore && existsAfter ? 'Already in wishlist' : 'Added to wishlist');
        }
      } catch (err) {
        console.error('Wishlist toggle failed:', err);
        toast.error('Failed to update wishlist');
      }
    } else {
      setWishlist((prevWish) => {
        const exists = prevWish.some(
          item => (item.product?._id || item.product?.id || item._id) === productId
        );
        if (exists) {
          toast.info('Already in wishlist');
          return prevWish;
        } else {
          toast.success('Added to wishlist');
          return [...prevWish, { product }];
        }
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = getToken();
    if (user && token) {
      try {
        const res = await api.delete(`/wishlist/${productId}`);
        const wishData = getResponseData(res);
        if (Array.isArray(wishData)) setWishlist(wishData);
      } catch (err) {
        console.error('Remove from wishlist failed:', err);
        toast.error('Failed to remove from wishlist');
      }
      return;
    }

    setWishlist((prevWish) => prevWish.filter(
      item => (item.product?._id || item.product?.id || item._id) !== productId
    ));
  };

  const totalCartItems = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0) 
    : 0;
    
  const totalWishlistItems = Array.isArray(wishlist) ? wishlist.length : 0;

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        totalCartItems,
        totalWishlistItems,
        loading
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);