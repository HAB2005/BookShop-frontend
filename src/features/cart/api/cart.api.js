import client from '../../../api/client.js';
import { CART } from '../../../api/endpoints.js';

// ==================== CART OPERATIONS ====================

/**
 * Get user's cart with all items
 */
export const getCartApi = async () => {
    const response = await client.get(CART.GET);
    return response;
};

/**
 * Add item to cart
 */
export const addToCartApi = async (productId, quantity) => {
    const response = await client.post(CART.ADD_ITEM, {
        productId,
        quantity
    });
    return response;
};

/**
 * Update cart item quantity
 */
export const updateCartItemApi = async (cartItemId, quantity) => {
    const response = await client.put(CART.UPDATE_ITEM(cartItemId), {
        quantity
    });
    return response;
};

/**
 * Remove item from cart
 */
export const removeFromCartApi = async (cartItemId) => {
    const response = await client.delete(CART.REMOVE_ITEM(cartItemId));
    return response;
};

/**
 * Clear entire cart
 */
export const clearCartApi = async () => {
    const response = await client.delete(CART.CLEAR);
    return response;
};