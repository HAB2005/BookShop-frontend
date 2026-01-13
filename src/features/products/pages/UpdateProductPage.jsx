import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts.js';
import { updateProductApi, assignCategoriesToProductApi } from '../api/products.api.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import { useToastContext } from '../../../app/providers.jsx';
import TabContainer from '../../../shared/ui/TabContainer.jsx';
import ProductForm from '../components/ProductForm.jsx';
import StatusSelector from '../components/StatusSelector.jsx';
import IntegratedImageManager from '../components/IntegratedImageManager.jsx';
import CategoryTreeSelector from '../components/CategoryTreeSelector.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import styles from './UpdateProductPage.module.css';

function UpdateProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToastContext();
  const { product, loading: productLoading, error: productError, fetchProduct } = useProduct(productId);
  const [updating, setUpdating] = useState(false);
  const [productData, setProductData] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesChanged, setCategoriesChanged] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Add form state management
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    book: {
      isbn: '',
      description: '',
      publishYear: '',
      pageCount: '',
      language: ''
    }
  });
  const [isBookProduct, setIsBookProduct] = useState(false);

  // Set page layout
  usePageLayout({
    title: "Update Product",
    breadcrumbs: ['Dashboard', 'Products', 'Update Product']
  });

  // Fetch product data on mount
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  // Update local product data when product changes
  useEffect(() => {
    if (product) {
      setProductData(product);
      // Initialize form data
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        book: {
          isbn: product.book?.isbn || '',
          description: product.book?.description || '',
          publishYear: product.book?.publishYear?.toString() || '',
          pageCount: product.book?.pageCount?.toString() || '',
          language: product.book?.language || ''
        }
      });
      setIsBookProduct(!!product.book);
      // Initialize selected categories
      const categoryIds = product.categories ? product.categories.map(cat => cat.categoryId) : [];
      setSelectedCategories(categoryIds);
      setCategoriesChanged(false);
    }
  }, [product]);

  const handleSubmit = async (submitData) => {
    try {
      setUpdating(true);
      
      // Update product basic info
      await updateProductApi(productId, submitData);
      
      // Update categories if changed
      if (categoriesChanged) {
        await assignCategoriesToProductApi(productId, selectedCategories);
      }
      
      success('Product updated successfully');
      setHasUnsavedChanges(false);
      navigate('/products/edit-list');
    } catch (error) {
      showError('Failed to update product');
      console.error('Failed to update product:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProduct = async () => {
    // Validate form data
    if (!formData.name.trim()) {
      showError('Product name is required');
      return;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      showError('Valid price is required');
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price)
    };

    // Add book data if it's a book product and has any book fields filled
    if (isBookProduct) {
      const bookData = {};
      if (formData.book.isbn) bookData.isbn = formData.book.isbn.trim();
      if (formData.book.description) bookData.description = formData.book.description.trim();
      if (formData.book.publishYear) bookData.publishYear = parseInt(formData.book.publishYear);
      if (formData.book.pageCount) bookData.pageCount = parseInt(formData.book.pageCount);
      if (formData.book.language) bookData.language = formData.book.language.trim();
      
      if (Object.keys(bookData).length > 0) {
        submitData.book = bookData;
      }
    }

    await handleSubmit(submitData);
  };

  const handleFormDataChange = (newFormData, newIsBookProduct) => {
    setFormData(newFormData);
    setIsBookProduct(newIsBookProduct);
    setHasUnsavedChanges(true);
  };

  const handleCancel = () => {
    navigate('/products/edit-list');
  };

  const handleStatusChange = (newStatus) => {
    setProductData(prev => ({ ...prev, status: newStatus }));
  };

  const handleImagesChange = (newImages) => {
    setProductImages(newImages);
    setProductData(prev => ({ ...prev, images: newImages }));
  };

  const handleCategorySelectionChange = (newCategoryIds) => {
    setSelectedCategories(newCategoryIds);
    setCategoriesChanged(true);
    setHasUnsavedChanges(true);
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const getPrimaryImage = () => {
    if (!productImages || productImages.length === 0) return null;
    return productImages.find(img => img.isPrimary) || productImages[0];
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    let filename = image.imageUrl || image.filename || image.url;
    
    if (!filename) return null;
    
    if (filename.startsWith('http')) {
      return filename;
    }
    
    if (filename.startsWith('products/')) {
      return `${baseUrl}/files/${filename}`;
    }
    
    const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;
    return `${baseUrl}/files/products/${productId}/${cleanFilename}`;
  };

  const primaryImage = getPrimaryImage();
  const imageUrl = getImageUrl(primaryImage);

  if (productLoading) {
    return (
      <div className={styles.updateProductPage}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className={styles.updateProductPage}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Error Loading Product</h2>
          <p>{productError}</p>
          <div className={styles.errorActions}>
            <button 
              onClick={() => fetchProduct(productId)}
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={handleCancel}
              className={styles.backButton}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className={styles.updateProductPage}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>📦</div>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been deleted.</p>
          <button 
            onClick={handleCancel}
            className={styles.backButton}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.updateProductPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Update Product</h1>
          <p className={styles.subtitle}>
            Modify product information and settings
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.productInfo}>
            <span className={styles.productId}>ID: {productData.productId}</span>
            <span className={styles.productStatus}>
              Status: <span className={`${styles.status} ${styles[productData.status?.toLowerCase()]}`}>
                {productData.status}
              </span>
            </span>
            {hasUnsavedChanges && (
              <div className={styles.unsavedIndicator}>
                <span className={styles.unsavedIcon}>●</span>
                Unsaved changes
              </div>
            )}
          </div>
          <div className={styles.actionButtons}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={updating}
            >
              <span className={styles.buttonIcon}>❌</span>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateProduct}
              className={styles.updateButton}
              disabled={updating}
            >
              <span className={styles.buttonIcon}>
                {updating ? '⏳' : '💾'}
              </span>
              {updating ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <TabContainer
          tabs={[
            {
              label: 'Basic Information',
              icon: '📝',
              content: (
                <div className={styles.tabContent}>
                  <ProductForm
                    initialData={{ ...formData, book: isBookProduct ? formData.book : null }}
                    onFormDataChange={handleFormDataChange}
                    loading={updating}
                    mode="edit"
                    hideActions={true}
                  />
                </div>
              )
            },
            {
              label: 'Product Images',
              icon: '🖼️',
              content: (
                <div className={styles.tabContent}>
                  <IntegratedImageManager
                    productId={productId}
                    onImagesChange={handleImagesChange}
                    showTitle={false}
                  />
                </div>
              )
            },
            {
              label: 'Categories',
              icon: '📂',
              badge: selectedCategories.length > 0 ? selectedCategories.length : null,
              content: (
                <div className={styles.tabContent}>
                  <div className={styles.categoryTabContent}>
                    <div className={styles.categoryHeader}>
                      <h3 className={styles.categoryTitle}>Select Categories</h3>
                      <div className={styles.categoryInfo}>
                        {selectedCategories.length} selected
                        {categoriesChanged && (
                          <span className={styles.changeIndicator}>
                            <span className={styles.changeIcon}>●</span>
                            Changes will be saved with the form
                          </span>
                        )}
                      </div>
                    </div>
                    <CategoryTreeSelector
                      selectedCategories={selectedCategories}
                      onSelectionChange={handleCategorySelectionChange}
                      disabled={updating}
                    />
                  </div>
                </div>
              )
            },
            {
              label: 'Settings',
              icon: '⚙️',
              content: (
                <div className={styles.tabContent}>
                  <div className={styles.settingsTabContent}>
                    <div className={styles.settingsSection}>
                      <h3 className={styles.settingsTitle}>Product Status</h3>
                      <p className={styles.settingsDescription}>
                        Control the visibility and availability of this product
                      </p>
                      <StatusSelector
                        productId={productId}
                        currentStatus={productData.status}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                    
                    <div className={styles.settingsSection}>
                      <h3 className={styles.settingsTitle}>Advanced Settings</h3>
                      <p className={styles.settingsDescription}>
                        Additional product configuration options
                      </p>
                      <div className={styles.advancedSettings}>
                        <div className={styles.settingItem}>
                          <label className={styles.settingLabel}>
                            <input type="checkbox" className={styles.settingCheckbox} />
                            Featured Product
                          </label>
                          <p className={styles.settingHelp}>Display this product prominently on the homepage</p>
                        </div>
                        
                        <div className={styles.settingItem}>
                          <label className={styles.settingLabel}>
                            <input type="checkbox" className={styles.settingCheckbox} />
                            Allow Reviews
                          </label>
                          <p className={styles.settingHelp}>Enable customer reviews for this product</p>
                        </div>
                        
                        <div className={styles.settingItem}>
                          <label className={styles.settingLabel}>
                            <input type="checkbox" className={styles.settingCheckbox} />
                            Track Inventory
                          </label>
                          <p className={styles.settingHelp}>Monitor stock levels for this product</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]}
          defaultTab={0}
        />
      </div>
    </div>
  );
}

export default UpdateProductPage;