import { useState, useCallback } from 'react';
import cartService from '../services/cartService.js';
import { useToastContext } from '../../../app/providers.jsx';

export const useCartSimple = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toast = useToastContext();

  // Load cart data - call manually
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cartService.getCart();
      
      if (result.success) {
        // Validate cart data structure
        const cartData = result.data || {};
        
        const validatedCart = {
          ...cartData,
          items: Array.isArray(cartData.items) ? cartData.items : [],
          totalAmount: typeof cartData.totalAmount === 'number' ? cartData.totalAmount : 0,
          totalItems: typeof cartData.totalItems === 'number' ? cartData.totalItems : 0
        };
        
        setCart(validatedCart);
        return { success: true, data: validatedCart };
      } else {
        setError(result.error);
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      const errorMessage = 'Failed to load cart';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]); // Only depend on toast

  // Add item to cart
  const addItem = useCallback(async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cartService.addToCart(productId, quantity);
      
      if (result.success) {
        setCart(result.data);
        toast.success(result.message);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to add item to cart';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Computed values with safe defaults
  const isEmpty = !cart || !cart.items || cart.items.length === 0;
  const totalAmount = (cart && typeof cart.totalAmount === 'number') ? cart.totalAmount : 0;
  const totalItems = (cart && typeof cart.totalItems === 'number') ? cart.totalItems : 0;
  const items = (cart && Array.isArray(cart.items)) ? cart.items : [];

  return {
    // State
    cart,
    items,
    loading,
    error,
    
    // Computed values
    isEmpty,
    totalAmount,
    totalItems,
    
    // Actions
    loadCart,
    addItem,
    
    // Utilities
    formatPrice: cartService.formatPrice
  };
};