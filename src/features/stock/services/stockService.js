import {
    getStockByProductIdApi,
    getStocksByProductIdsApi,
    createStockApi,
    createStockFromRequestApi,
    addStockApi,
    setStockApi,
    getLowStockItemsApi,
    getStockStatisticsApi
} from '../api/stock.api.js';

class StockService {
    // ==================== STOCK QUERY OPERATIONS ====================

    /**
     * Get stock information for a single product
     */
    async getStockByProductId(productId) {
        try {
            const validation = this.validateProductId(productId);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await getStockByProductIdApi(productId);
            return {
                success: true,
                data: response.data.data,
                message: 'Stock information loaded successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load stock information',
                details: error.response?.data
            };
        }
    }

    /**
     * Get stock information for multiple products
     */
    async getStocksByProductIds(productIds) {
        try {
            if (!Array.isArray(productIds) || productIds.length === 0) {
                return {
                    success: false,
                    error: 'Product IDs array is required'
                };
            }

            const response = await getStocksByProductIdsApi(productIds);
            return {
                success: true,
                data: response.data.data,
                message: 'Stock information loaded successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load stock information',
                details: error.response?.data
            };
        }
    }

    /**
     * Get low stock items
     */
    async getLowStockItems() {
        try {
            const response = await getLowStockItemsApi();
            return {
                success: true,
                data: response.data.data,
                message: 'Low stock items loaded successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load low stock items',
                details: error.response?.data
            };
        }
    }

    /**
     * Get stock statistics
     */
    async getStockStatistics() {
        try {
            const response = await getStockStatisticsApi();
            return {
                success: true,
                data: response.data.data,
                message: 'Stock statistics loaded successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to load stock statistics',
                details: error.response?.data
            };
        }
    }

    // ==================== STOCK COMMAND OPERATIONS ====================

    /**
     * Create stock for a product
     */
    async createStock(productId, initialQuantity = 0, lowStockThreshold = 5) {
        try {
            const validation = this.validateCreateStock(productId, initialQuantity, lowStockThreshold);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await createStockApi(productId, initialQuantity, lowStockThreshold);
            return {
                success: true,
                data: response.data.data,
                message: 'Stock created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create stock',
                details: error.response?.data
            };
        }
    }

    /**
     * Create stock from request object
     */
    async createStockFromRequest(request) {
        try {
            const validation = this.validateCreateStockRequest(request);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await createStockFromRequestApi(request);
            return {
                success: true,
                data: response.data.data,
                message: 'Stock created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create stock',
                details: error.response?.data
            };
        }
    }

    /**
     * Add stock (restock)
     */
    async addStock(productId, quantity, reason = '') {
        try {
            const validation = this.validateStockUpdate(productId, quantity);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await addStockApi(productId, quantity, reason);
            return {
                success: true,
                data: response.data.data,
                message: `Successfully added ${quantity} units to stock`
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to add stock',
                details: error.response?.data
            };
        }
    }

    /**
     * Set stock quantity (adjust)
     */
    async setStock(productId, quantity, reason = '') {
        try {
            const validation = this.validateStockUpdate(productId, quantity);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.error
                };
            }

            const response = await setStockApi(productId, quantity, reason);
            return {
                success: true,
                data: response.data.data,
                message: `Successfully set stock to ${quantity} units`
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to set stock',
                details: error.response?.data
            };
        }
    }

    // ==================== VALIDATION METHODS ====================

    /**
     * Validate product ID
     */
    validateProductId(productId) {
        if (!productId) {
            return { isValid: false, error: 'Product ID is required' };
        }
        if (!Number.isInteger(productId) || productId <= 0) {
            return { isValid: false, error: 'Product ID must be a positive integer' };
        }
        return { isValid: true };
    }

    /**
     * Validate create stock parameters
     */
    validateCreateStock(productId, initialQuantity, lowStockThreshold) {
        const productValidation = this.validateProductId(productId);
        if (!productValidation.isValid) {
            return productValidation;
        }

        if (initialQuantity < 0) {
            return { isValid: false, error: 'Initial quantity cannot be negative' };
        }

        if (lowStockThreshold < 0) {
            return { isValid: false, error: 'Low stock threshold cannot be negative' };
        }

        return { isValid: true };
    }

    /**
     * Validate create stock request
     */
    validateCreateStockRequest(request) {
        if (!request || typeof request !== 'object') {
            return { isValid: false, error: 'Request object is required' };
        }

        return this.validateCreateStock(
            request.productId,
            request.initialQuantity || 0,
            request.lowStockThreshold || 5
        );
    }

    /**
     * Validate stock update parameters
     */
    validateStockUpdate(productId, quantity) {
        const productValidation = this.validateProductId(productId);
        if (!productValidation.isValid) {
            return productValidation;
        }

        if (!Number.isInteger(quantity) || quantity < 0) {
            return { isValid: false, error: 'Quantity must be a non-negative integer' };
        }

        return { isValid: true };
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Check if stock is low
     */
    isLowStock(stock) {
        if (!stock) return false;
        return stock.availableQuantity <= stock.lowStockThreshold;
    }

    /**
     * Format stock status
     */
    formatStockStatus(stock) {
        if (!stock) return 'No Stock Info';

        if (stock.availableQuantity === 0) {
            return 'Out of Stock';
        } else if (this.isLowStock(stock)) {
            return 'Low Stock';
        } else {
            return 'In Stock';
        }
    }

    /**
     * Get stock status color
     */
    getStockStatusColor(stock) {
        if (!stock) return 'gray';

        if (stock.availableQuantity === 0) {
            return 'red';
        } else if (this.isLowStock(stock)) {
            return 'orange';
        } else {
            return 'green';
        }
    }
}

export default new StockService();