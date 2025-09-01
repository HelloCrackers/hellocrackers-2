import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  productCode: string;
  productName: string;
  finalRate: number;
  quantity: number;
  image: string;
  userFor: string;
}

interface CartContextType {
  cart: CartItem[];
  cartTotal: number;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productCode: string) => void;
  updateQuantity: (productCode: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  checkMinimumOrder: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  console.log('useCart called, context:', context);
  if (!context) {
    console.error('CartContext is undefined - useCart must be used within a CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('CartProvider rendering with children:', !!children);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const cartTotal = cart.reduce((total, item) => total + (item.finalRate * item.quantity), 0);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productCode === product.productCode);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.productCode === product.productCode
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${product.productName} (${quantity} qty) added to cart`,
    });
  };

  const removeFromCart = (productCode: string) => {
    setCart(prevCart => prevCart.filter(item => item.productCode !== productCode));
  };

  const updateQuantity = (productCode: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productCode);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productCode === productCode
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const checkMinimumOrder = () => {
    return cartTotal >= 3000;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        checkMinimumOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};