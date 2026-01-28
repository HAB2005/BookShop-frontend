import { useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService.js';
import { useToastContext } from '../../../app/providers.jsx';

export const useCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const toast = useToastContext();

    // Load cart data
    const loadCart = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await cartService.getCart();

            if (result.success) {
                setCart(result.data);
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (error) {
            const errorMessage = 'Failed to load cart';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Add item to cart
    const addItem = useCallback(async (productId, quantity = 1) => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await cartService.addToCart(productId, quantity);

            if (result.success) {
                setCart(result.data);
                toast.success(result.message);
                return { success: true };
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
            setActionLoading(false);
        }
    }, [toast]);

    // Update cart item quantity
    const updateItem = useCallback(async (cartItemId, quantity) => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await cartService.updateCartItem(cartItemId, quantity);

            if (result.success) {
                setCart(result.data);
                toast.success(result.message);
                return { success: true };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to update cart item';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setActionLoading(false);
        }
    }, [toast]);

    // Remove item from cart
    const removeItem = useCallback(async (cartItemId) => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await cartService.removeFromCart(cartItemId);

            if (result.success) {
                setCart(result.data);
                toast.success(result.message);
                return { success: true };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to remove item from cart';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setActionLoading(false);
        }
    }, [toast]);

    // Clear entire cart
    const clearCart = useCallback(async () => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await cartService.clearCart();

            if (result.success) {
                setCart({ ...cart, items: [], totalAmount: 0, totalItems: 0 });
                toast.success(result.message);
                return { success: true };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to clear cart';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setActionLoading(false);
        }
    }, [cart, toast]);

    // Load cart on mount
    useEffect(() => {
        loadCart();
    }, [loadCart]); // Keep loadCart but it's now stable with useCallback

    // Computed values
    const isEmpty = cartService.isCartEmpty(cart);
    const totalAmount = cart?.totalAmount || 0;
    const totalItems = cart?.totalItems || 0;
    const items = cart?.items || [];

    return {
        // State
        cart,
        items,
        loading,
        error,
        actionLoading,

        // Computed values
        isEmpty,
        totalAmount,
        totalItems,

        // Actions
        loadCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,

        // Utilities
        formatPrice: cartService.formatPrice,
        calculateTotal: cartService.calculateTotal,
        calculateTotalItems: cartService.calculateTotalItems
    };
};