import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import productService from '../services/productService.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorBoundary from '../../../shared/components/ErrorBoundary.jsx';
import { useToastContext } from '../../../app/providers.jsx';
import styles from './ProductDetailPage.module.css';

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToastContext();
  
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const isCustomer = user?.role === 'customer';
  const isAdmin = user?.role === 'admin';

  // Set page layout
  usePageLayout({
    title: product?.name || "Product Details",
    breadcrumbs: ['Products', product?.name || 'Loading...']
  });

  // Load product details
  useEffect(() => {
    const loadProductDetail = async () => {
      if (!productId) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load product details
        const productResult = await productService.getProductDetail(productId);
        if (!productResult.success) {
          throw new Error(productResult.error || 'Failed to load product');
        }

        setProduct(productResult.data);

        // Load product images
        const imagesResult = await productService.getProductImages(productId);
        if (imagesResult.success && imagesResult.data.length > 0) {
          // Sort images using utility function
          const sortedImages = productService.sortImagesByPrimary(imagesResult.data);
          setImages(sortedImages);
        }

      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message || 'Failed to load product details');
        toast.error(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productId, toast]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImageUrl = (imageData) => {
    if (!imageData || !product) return null;
    return productService.getImageUrl(product.productId, imageData.imageUrl || imageData.filename);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isCustomer) {
      toast.error('Please login as customer to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      // TODO: Implement add to cart API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success(`Added ${quantity} ${product.name} to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isCustomer) {
      toast.error('Please login as customer to purchase');
      return;
    }

    // TODO: Implement buy now functionality
    toast.info('Buy now feature coming soon!');
  };

  const handleAddToFavorites = async () => {
    if (!isCustomer) {
      toast.error('Please login as customer to add to favorites');
      return;
    }

    try {
      // TODO: Implement add to favorites API call
      toast.success('Added to favorites');
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const getDescriptionText = () => {
    const description = product.description || product.book?.description || product.productDescription || product.details?.description;
    if (!description) return '';
    
    // Always return full text, CSS will handle the truncation
    return description;
  };

  const shouldShowToggle = () => {
    const description = product.description || product.book?.description || product.productDescription || product.details?.description;
    return description && description.length > 300;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Product Not Found</h3>
        <p>{error || 'The requested product could not be found.'}</p>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <ErrorBoundary message="Failed to load product details. Please try refreshing the page.">
      <div className={styles.productDetailPage}>
        {/* Back Button */}
        <div className={styles.backButtonContainer}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/products')}
          >
            ← Back to Products
          </button>
        </div>

        <div className={styles.productContainer}>
          {/* Product Images */}
          <div className={styles.imageSection}>
            {/* Main Image */}
            <div className={styles.mainImageContainer}>
              {selectedImage ? (
                <img
                  src={getImageUrl(selectedImage)}
                  alt={product.name}
                  className={styles.mainImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className={styles.placeholderMainImage}>
                  <span className={styles.placeholderIcon}>📚</span>
                  <span className={styles.placeholderText}>No Image Available</span>
                </div>
              )}
              
              {selectedImage && (
                <div className={styles.placeholderMainImage} style={{ display: 'none' }}>
                  <span className={styles.placeholderIcon}>📚</span>
                  <span className={styles.placeholderText}>Image Not Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {images.map((image, index) => (
                  <div
                    key={image.imageId || index}
                    className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.activeThumbnail : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className={styles.thumbnailImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className={styles.thumbnailPlaceholder} style={{ display: 'none' }}>
                      📚
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className={styles.infoSection}>
            {/* Product Header */}
            <div className={styles.productHeader}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <div className={styles.priceContainer}>
                <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                    <span className={styles.discount}>
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Product Stats */}
            <div className={styles.productStats}>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>📦</span>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Status</span>
                  <span className={`${styles.statValue} ${styles.statusBadge} ${styles[product.status?.toLowerCase()]}`}>
                    {product.status === 'ACTIVE' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statIcon}>📅</span>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Added</span>
                  <span className={styles.statValue}>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {(product.soldCount || product.salesCount) && (
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🛒</span>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Sold</span>
                    <span className={styles.statValue}>{product.soldCount || product.salesCount}</span>
                  </div>
                </div>
              )}
              {(product.rating || product.averageRating) && (
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>⭐</span>
                  <div className={styles.statContent}>
                    <span className={styles.statLabel}>Rating</span>
                    <span className={styles.statValue}>
                      {product.rating || product.averageRating} ({product.reviewCount || product.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Description */}
            {(product.description || product.book?.description || product.productDescription || product.details?.description) && (
              <div className={styles.descriptionSection}>
                <h3>📖 Description</h3>
                <div className={styles.descriptionContent}>
                  <p className={`${styles.description} ${isDescriptionExpanded ? styles.expanded : styles.collapsed}`}>
                    {getDescriptionText()}
                  </p>
                  {shouldShowToggle() && (
                    <button 
                      className={styles.toggleButton}
                      onClick={toggleDescription}
                    >
                      {isDescriptionExpanded ? (
                        <>
                          <span>Show Less</span>
                          <span className={`${styles.toggleIcon} ${styles.rotated}`}>▲</span>
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <span className={styles.toggleIcon}>▼</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Book Details (if applicable) */}
            {product.book && (
              <div className={styles.bookDetails}>
                <h3>📚 Book Information</h3>
                <div className={styles.detailsGrid}>
                  {product.book.isbn && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>🏷️</span>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>ISBN</span>
                        <span className={styles.detailValue}>{product.book.isbn}</span>
                      </div>
                    </div>
                  )}
                  {product.book.publishYear && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>📅</span>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Publication Year</span>
                        <span className={styles.detailValue}>{product.book.publishYear}</span>
                      </div>
                    </div>
                  )}
                  {product.book.pageCount && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>📄</span>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Pages</span>
                        <span className={styles.detailValue}>{product.book.pageCount}</span>
                      </div>
                    </div>
                  )}
                  {product.book.language && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>🌐</span>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Language</span>
                        <span className={styles.detailValue}>{product.book.language}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Purchase Section - Only for customers */}
            {isCustomer && product.status === 'ACTIVE' && (
              <div className={styles.purchaseSection}>
                {/* Quantity Selector */}
                <div className={styles.quantitySection}>
                  <span className={styles.quantityLabel}>Quantity:</span>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= 99) {
                          setQuantity(value);
                        }
                      }}
                      className={styles.quantityInput}
                      min="1"
                      max="99"
                    />
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 99}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <LoadingSpinner size="small" />
                        Adding...
                      </>
                    ) : (
                      <>
                        🛒 Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button
                    className={styles.buyNowButton}
                    onClick={handleBuyNow}
                  >
                    ⚡ Buy Now
                  </button>
                  
                  <button
                    className={styles.favoriteButton}
                    onClick={handleAddToFavorites}
                    title="Add to Favorites"
                  >
                    ❤️
                  </button>
                </div>

                {/* Total Price */}
                <div className={styles.totalPrice}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalValue}>{formatPrice(product.price * quantity)}</span>
                </div>
              </div>
            )}

            {/* Message for non-customers or inactive products */}
            {!isCustomer && !isAdmin && (
              <div className={styles.loginPrompt}>
                <p>Please <button onClick={() => navigate('/login')} className={styles.loginLink}>login</button> to purchase this product</p>
              </div>
            )}

            {isCustomer && product.status !== 'ACTIVE' && (
              <div className={styles.unavailableMessage}>
                <p>⚠️ This product is currently unavailable</p>
              </div>
            )}

            {/* Admin Actions */}
            {isAdmin && (
              <div className={styles.adminActions}>
                <button
                  className={styles.editButton}
                  onClick={() => navigate(`/products/edit/${product.productId}`)}
                >
                  ✏️ Edit Product
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section - Placeholder */}
        <div className={styles.relatedSection}>
          <h2>Related Products</h2>
          <div className={styles.relatedPlaceholder}>
            <p>Related products feature will be added in the future</p>
          </div>
        </div>

        {/* Reviews Section - Placeholder */}
        <div className={styles.reviewsSection}>
          <h2>Product Reviews</h2>
          <div className={styles.reviewsPlaceholder}>
            <p>Product reviews feature will be added in the future</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ProductDetailPage;