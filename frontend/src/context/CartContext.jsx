import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('foodiehub_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState(() => {
    return localStorage.getItem('foodiehub_promo') || '';
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodiehub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync promo code
  useEffect(() => {
    if (promoCode) {
      localStorage.setItem('foodiehub_promo', promoCode);
    } else {
      localStorage.removeItem('foodiehub_promo');
    }
  }, [promoCode]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (food, quantity = 1) => {
    if (!food.available) {
      showToast(`Sorry, "${food.name}" is currently unavailable`);
      return;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item._id === food._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            _id: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            category: food.category,
            isVeg: food.isVeg,
            quantity: quantity
          }
        ];
      }
    });

    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${food.name}" to cart! 🍽️`);
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => {
      const removed = prevItems.find((item) => item._id === foodId);
      if (removed) {
        showToast(`Removed "${removed.name}" from cart`);
      }
      return prevItems.filter((item) => item._id !== foodId);
    });
  };

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === foodId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    localStorage.removeItem('foodiehub_cart');
    localStorage.removeItem('foodiehub_promo');
  };

  const getItemQuantity = (foodId) => {
    const item = cartItems.find((i) => i._id === foodId);
    return item ? item.quantity : 0;
  };

  // Price calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Delivery fee is ₹0 if subtotal >= ₹500, otherwise ₹40
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;

  // Coupon discount calculation: FOODIE30 gives 30% discount capped at ₹150
  let discount = 0;
  if (promoCode.toUpperCase() === 'FOODIE30' && subtotal > 0) {
    discount = Math.min(Math.round(subtotal * 0.3), 150);
  }

  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FOODIE30') {
      setPromoCode('FOODIE30');
      showToast('🎉 Coupon "FOODIE30" applied! You saved 30%!');
      return { success: true, message: 'Coupon applied successfully!' };
    } else {
      showToast('❌ Invalid promo code. Try "FOODIE30"');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    showToast('Promo code removed');
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    subtotal,
    deliveryFee,
    promoCode,
    discount,
    applyPromoCode,
    removePromoCode,
    totalAmount,
    totalItemCount,
    toastMessage
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

