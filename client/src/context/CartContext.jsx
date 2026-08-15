import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

const PROMO_CODES = {
  CAMPUS2026: { type: 'percent', value: 15, description: '15% Campus Special Discount' },
  FIRST50: { type: 'flat', value: 50, description: '₹50 First Order Credit' },
  BUYKARO: { type: 'percent', value: 10, description: '10% BuyKaro Member Discount' },
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('buykaro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [meetupLocation, setMeetupLocation] = useState('Central Library Entrance');
  const [preferredTime, setPreferredTime] = useState('Today (4:00 PM - 6:00 PM)');

  useEffect(() => {
    try {
      localStorage.setItem('buykaro_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
        toast.info(`Updated "${product.title || 'Item'}" quantity in cart (${existing.quantity + quantity})`);
      } else {
        const newItem = {
          _id: product._id,
          title: product.title || product.description || 'Campus Item',
          price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
          image: product.image || '/Macbook/image.png',
          seller: product.seller || { name: 'Verified Student Seller', college: 'Campus' },
          condition: product.condition || 'Good condition',
          category: product.category || 'General',
          quantity: Math.max(1, quantity),
        };
        updated = [newItem, ...prev];
        toast.success(`🎉 Added "${newItem.title}" to your campus cart!`);
      }
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const item = prev.find((p) => p._id === productId);
      if (item) {
        toast.info(`Removed "${item.title}" from cart`);
      }
      return prev.filter((p) => p._id !== productId);
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a coupon code' };

    if (PROMO_CODES[clean]) {
      setAppliedPromo({ code: clean, ...PROMO_CODES[clean] });
      toast.success(`Coupon "${clean}" applied: ${PROMO_CODES[clean].description}`);
      return { success: true, message: PROMO_CODES[clean].description };
    } else {
      toast.error('Invalid coupon code. Try CAMPUS2026, BUYKARO, or FIRST50');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast.info('Coupon removed');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'flat') {
      discountAmount = Math.min(cartSubtotal, appliedPromo.value);
    }
  }

  const campusServiceFee = 0; // Free for students!
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + campusServiceFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        discountAmount,
        cartTotal,
        campusServiceFee,
        appliedPromo,
        promoCode,
        setPromoCode,
        meetupLocation,
        setMeetupLocation,
        preferredTime,
        setPreferredTime,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
