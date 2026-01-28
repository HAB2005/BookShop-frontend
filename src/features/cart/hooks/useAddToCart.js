import { useState } from 'react';
import cartService from '../services/cartService.js';
import { useToastContext } from '../../../app/providers.jsx';

export const useAddToCart = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToastContext();

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    
    try {
      const result = await cartService.addToCart(productId, quantity);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true, data: result.data };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    addToCart,
    loading
  };
};