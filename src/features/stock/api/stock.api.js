import client from '../../../api/client.js';
import { STOCK } from '../../../api/endpoints.js';

// ==================== STOCK API ENDPOINTS ====================

/**
 * Get stock information for a single product
 */
export const getStockByProductIdApi = (productId) => {
    return client.get(STOCK.GET_BY_PRODUCT(productId));
};

/**
 * Get stock information for multiple products
 */
export const getStocksByProductIdsApi = (productIds) => {
    const params = new URLSearchParams();
    productIds.forEach(id => params.append('productIds', id));
    return client.get(`${STOCK.GET_BY_PRODUCTS}?${params.toString()}`);
};

/**
 * Create stock for a product (with params)
 */
export const createStockApi = (productId, initialQuantity = 0, lowStockThreshold = 5) => {
    return client.post(STOCK.CREATE(productId), null, {
        params: {
            initialQuantity,
            lowStockThreshold
        }
    });
};

/**
 * Create stock for a product (with request body)
 */
export const createStockFromRequestApi = (request) => {
    return client.post(STOCK.CREATE_FROM_REQUEST, request);
};

/**
 * Add stock (restock)
 */
export const addStockApi = (productId, quantity, reason) => {
    return client.post(STOCK.ADD(productId), {
        quantity,
        reason
    });
};

/**
 * Set/adjust stock quantity
 */
export const setStockApi = (productId, quantity, reason) => {
    return client.put(STOCK.SET(productId), {
        quantity,
        reason
    });
};

/**
 * Get low stock items
 */
export const getLowStockItemsApi = () => {
    return client.get(STOCK.LOW_STOCK);
};

/**
 * Get stock statistics
 */
export const getStockStatisticsApi = () => {
    return client.get(STOCK.STATISTICS);
};