import {
    getCartApi,
    addToCartApi,
    updateCartItemApi,
    removeFromCartApi,
    clearCartApi
} from '../api/cart.api.js';

class CartService {
    // ==================== CART OPERATIONS ====================

    /**
     * Get user's cart
     */
    async getCart() {
        try {
            const response = await getCartApi();
            return {
                success: true,
                data: response.data,
                message: 'Cart loaded successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load cart',
                details: error.response?.data
            };
        }
    }

    /**
     * Add item to cart
     */
    async addToCart(productId, quantity = 1) {
        try {
            // Validate inputs
            const validation = this.validateAddToCart(productId, quantity);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await addToCartApi(productId, quantity);
            return {
                success: true,
                data: response.data,
                message: 'Item added to cart successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to add item to cart',
                details: error.response?.data
            };
        }
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(cartItemId, quantity) {
        try {
            // Validate inputs
            const validation = this.validateQuantity(quantity);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await updateCartItemApi(cartItemId, quantity);
            return {
                success: true,
                data: response.data,
                message: 'Cart item updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update cart item',
                details: error.response?.data
            };
        }
    }

    /**
     * Remove item from cart
     */
    async removeFromCart(cartItemId) {
        try {
            if (!cartItemId) {
                return {
                    success: false,
                    error: 'Cart item ID is required'
                };
            }

            const response = await removeFromCartApi(cartItemId);
            return {
                success: true,
                data: response.data,
                message: 'Item removed from cart successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to remove item from cart',
                details: error.response?.data
            };
        }
    }

    /**
     * Clear entire cart
     */
    async clearCart() {
        try {
            const response = await clearCartApi();
            return {
                success: true,
                data: response.data,
                message: 'Cart cleared successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to clear cart',
                details: error.response?.data
            };
        }
    }

    // ==================== VALIDATION HELPERS ====================

    /**
     * Validate add to cart request
     */
    validateAddToCart(productId, quantity) {
        if (!productId) {
            return {
                isValid: false,
                error: 'Product ID is required'
            };
        }

        if (typeof productId !== 'number' || productId <= 0) {
            return {
                isValid: false,
                error: 'Invalid product ID'
            };
        }

        return this.validateQuantity(quantity);
    }

    /**
     * Validate quantity
     */
    validateQuantity(quantity) {
        if (!quantity) {
            return {
                isValid: false,
                error: 'Quantity is required'
            };
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            return {
                isValid: false,
                error: 'Quantity must be a positive number'
            };
        }

        if (quantity > 99) {
            return {
                isValid: false,
                error: 'Quantity cannot exceed 99'
            };
        }

        return {
            isValid: true
        };
    }

    // ==================== UTILITY HELPERS ====================

    /**
     * Calculate cart total amount
     */
    calculateTotal(cartItems) {
        if (!cartItems || !Array.isArray(cartItems)) {
            return 0;
        }

        return cartItems.reduce((total, item) => {
            return total + (item.subtotal || 0);
        }, 0);
    }

    /**
     * Calculate total items count
     */
    calculateTotalItems(cartItems) {
        if (!cartItems || !Array.isArray(cartItems)) {
            return 0;
        }

        return cartItems.reduce((total, item) => {
            return total + (item.quantity || 0);
        }, 0);
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (typeof price !== 'number') {
            return '0 ₫';
        }

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    /**
     * Check if cart is empty
     */
    isCartEmpty(cart) {
        return !cart || !cart.items || cart.items.length === 0;
    }
}

// Export singleton instance
const cartService = new CartService();
export default cartService;