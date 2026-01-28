import { useState, useEffect } from 'react';
import { useStock } from '../hooks/useStock.js';
import { getProductsApi } from '../../product/api/product.api.js';
import StockBadge from '../components/StockBadge.jsx';
import StockUpdateModal from '../components/StockUpdateModal.jsx';
import LowStockAlert from '../components/LowStockAlert.jsx';
import StockStatistics from '../components/StockStatistics.jsx';
import styles from '../styles/stock.module.css';

const StockManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { stocks, getStocks } = useStock();

    // Load products from API
    useEffect(() => {
        loadProducts();
    }, [currentPage, searchTerm]);

    // Load stocks when products change
    useEffect(() => {
        if (products.length > 0) {
            const productIds = products.map(p => p.productId);
            getStocks(productIds);
        }
    }, [products, getStocks]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                size: 20,
                sortBy: 'name',
                sortDir: 'asc',
                includeAllStatuses: true // Include all products for stock management
            };

            if (searchTerm.trim()) {
                params.name = searchTerm.trim();
            }

            const response = await getProductsApi(params);
            
            if (response.data && response.data.content) {
                setProducts(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            } else {
                setProducts([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product, mode) => {
        setSelectedProduct(product);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        // Reload stocks after modal closes to get updated data
        if (products.length > 0) {
            const productIds = products.map(p => p.productId);
            getStocks(productIds);
        }
    };

    const handleProductClick = (productId) => {
        const product = products.find(p => p.productId === productId);
        if (product) {
            handleOpenModal(product, 'add');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // Reset to first page when searching
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const filteredProducts = products.filter(product => {
        const stock = stocks[product.productId];
        
        if (filterStatus === 'all') return true;
        if (filterStatus === 'in-stock') return stock && stock.availableQuantity > 0;
        if (filterStatus === 'low-stock') return stock && stock.isLowStock;
        if (filterStatus === 'out-of-stock') return !stock || stock.availableQuantity === 0;
        if (filterStatus === 'no-stock-info') return !stock;
        
        return true;
    });

    if (loading && products.length === 0) {
        return (
            <div className={styles.stockManagementPage}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.stockManagementPage}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>❌</div>
                    <h3>Error Loading Products</h3>
                    <p>{error}</p>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={loadProducts}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.stockManagementPage}>
            <div className={styles.pageHeader}>
                <h1>📦 Stock Management</h1>
                <p>Manage inventory levels for all products</p>
            </div>

            {/* Statistics Section */}
            <div className={styles.section}>
                <StockStatistics />
            </div>

            {/* Low Stock Alert */}
            <div className={styles.section}>
                <LowStockAlert onProductClick={handleProductClick} />
            </div>

            {/* Filters and Search */}
            <div className={styles.section}>
                <div className={styles.filtersContainer}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Search products by name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                        />
                    </div>
                    
                    <div className={styles.filterGroup}>
                        <label>Filter by status:</label>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Products</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                            <option value="no-stock-info">No Stock Info</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className={styles.section}>
                <div className={styles.tableContainer}>
                    <table className={styles.productsTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock Status</th>
                                <th>Available Quantity</th>
                                <th>Low Stock Threshold</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className={styles.loadingCell}>
                                        <div className={styles.loadingSpinner}></div>
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.emptyCell}>
                                        {products.length === 0 ? 'No products found' : 'No products match the current filter'}
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => {
                                    const stock = stocks[product.productId];
                                    return (
                                        <tr key={product.productId}>
                                            <td>
                                                <div className={styles.productInfo}>
                                                    <strong>{product.name}</strong>
                                                    <small>ID: {product.productId}</small>
                                                </div>
                                            </td>
                                            <td className={styles.priceCell}>
                                                ${product.price}
                                            </td>
                                            <td>
                                                <StockBadge stock={stock} showQuantity={false} />
                                            </td>
                                            <td className={styles.quantityCell}>
                                                <strong>
                                                    {stock ? stock.availableQuantity : 'N/A'}
                                                </strong>
                                            </td>
                                            <td className={styles.thresholdCell}>
                                                {stock ? stock.lowStockThreshold : 'N/A'}
                                            </td>
                                            <td>
                                                <div className={styles.actionButtons}>
                                                    {!stock ? (
                                                        <button
                                                            className={`${styles.btn} ${styles.btnSmall} ${styles.btnPrimary}`}
                                                            onClick={() => handleOpenModal(product, 'create')}
                                                        >
                                                            Create Stock
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className={`${styles.btn} ${styles.btnSmall} ${styles.btnSuccess}`}
                                                                onClick={() => handleOpenModal(product, 'add')}
                                                            >
                                                                Add Stock
                                                            </button>
                                                            <button
                                                                className={`${styles.btn} ${styles.btnSmall} ${styles.btnWarning}`}
                                                                onClick={() => handleOpenModal(product, 'set')}
                                                            >
                                                                Set Stock
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={styles.paginationContainer}>
                        <div className={styles.pagination}>
                            <button 
                                className={styles.paginationBtn}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </button>
                            
                            <div className={styles.paginationInfo}>
                                Page {currentPage + 1} of {totalPages}
                            </div>
                            
                            <button 
                                className={styles.paginationBtn}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stock Update Modal */}
            <StockUpdateModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productId={selectedProduct?.productId}
                productName={selectedProduct?.name}
                currentStock={selectedProduct ? stocks[selectedProduct.productId] : null}
                mode={modalMode}
            />
        </div>
    );
};

export default StockManagementPage;