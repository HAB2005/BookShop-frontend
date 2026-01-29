import { useState, useEffect, useCallback } from 'react';
import stockService from '../services/stockService.js';
import { useToastContext } from '../../../app/providers.jsx';

export const useStock = () => {
    const [stocks, setStocks] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const toast = useToastContext();

    // Get stock for single product
    const getStock = useCallback(async (productId) => {
        setLoading(true);
        setError(null);

        try {
            const result = await stockService.getStockByProductId(productId);

            if (result.success) {
                setStocks(prev => ({
                    ...prev,
                    [productId]: result.data
                }));
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to load stock information';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Get stocks for multiple products
    const getStocks = useCallback(async (productIds) => {
        setLoading(true);
        setError(null);

        try {
            const result = await stockService.getStocksByProductIds(productIds);

            if (result.success) {
                setStocks(prev => ({
                    ...prev,
                    ...result.data
                }));
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to load stock information';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Create stock
    const createStock = useCallback(async (productId, initialQuantity = 0, lowStockThreshold = 5) => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await stockService.createStock(productId, initialQuantity, lowStockThreshold);

            if (result.success) {
                setStocks(prev => ({
                    ...prev,
                    [productId]: result.data
                }));
                toast.success(result.message);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to create stock';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setActionLoading(false);
        }
    }, [toast]);

    // Add stock (restock)
    const addStock = useCallback(async (productId, quantity, reason = '') => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await stockService.addStock(productId, quantity, reason);

            if (result.success) {
                setStocks(prev => ({
                    ...prev,
                    [productId]: result.data
                }));
                toast.success(result.message);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to add stock';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setActionLoading(false);
        }
    }, [toast]);

    // Set stock (adjust)
    const setStock = useCallback(async (productId, quantity, reason = '') => {
        setActionLoading(true);
        setError(null);

        try {
            const result = await stockService.setStock(productId, quantity, reason);

            if (result.success) {
                setStocks(prev => ({
                    ...prev,
                    [productId]: result.data
                }));
                toast.success(result.message);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to set stock';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setActionLoading(false);
        }
    }, [toast]);

    return {
        stocks,
        loading,
        error,
        actionLoading,
        getStock,
        getStocks,
        createStock,
        addStock,
        setStock,
        // Utility functions
        isLowStock: stockService.isLowStock,
        formatStockStatus: stockService.formatStockStatus,
        getStockStatusColor: stockService.getStockStatusColor
    };
};

// Hook for low stock items
export const useLowStock = () => {
    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToastContext();

    const loadLowStockItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await stockService.getLowStockItems();

            if (result.success) {
                setLowStockItems(result.data);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to load low stock items';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Load data only once on mount, not on every loadLowStockItems change
    useEffect(() => {
        loadLowStockItems();
    }, []); // Remove loadLowStockItems dependency to prevent infinite loop

    return {
        lowStockItems,
        loading,
        error,
        loadLowStockItems
    };
};

// Hook for stock statistics
export const useStockStatistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toast = useToastContext();

    const loadStatistics = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await stockService.getStockStatistics();

            if (result.success) {
                setStatistics(result.data);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = 'Failed to load stock statistics';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Load data only once on mount, not on every loadStatistics change
    useEffect(() => {
        loadStatistics();
    }, []); // Remove loadStatistics dependency to prevent infinite loop

    return {
        statistics,
        loading,
        error,
        loadStatistics
    };
};