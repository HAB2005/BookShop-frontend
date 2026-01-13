import { useAuth } from '../../../shared/hooks/useAuth.js';
import productService from '../services/productService.js';
import styles from './ProductCard.module.css';

function ProductCard({ product, onProductUpdated }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImageUrl = (productId, imageData) => {
    if (!imageData) return null;
    
    // Handle different possible image data structures
    let filename = null;
    
    if (typeof imageData === 'string') {
      // If imageData is just a filename string
      filename = imageData;
    } else if (imageData.imageUrl) {
      // If imageData has imageUrl property
      filename = imageData.imageUrl;
    } else if (imageData.filename) {
      // If imageData has filename property
      filename = imageData.filename;
    } else if (imageData.url) {
      // If imageData has url property
      filename = imageData.url;
    }
    
    if (!filename) return null;
    
    // If filename already contains full URL, return as is
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Build URL using productService
    const url = productService.getImageUrl(productId, filename);
    
    return url;
  };

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0] ||
                       product.productImages?.find(img => img.isPrimary) || product.productImages?.[0] ||
                       product.imageList?.find(img => img.isPrimary) || product.imageList?.[0];

  return (
    <div className={styles.productCard}>
      {/* Product Image */}
      <div className={styles.imageContainer}>
        {primaryImage ? (
          <>
            <img
              src={getImageUrl(product.productId, primaryImage)}
              alt={product.name}
              className={styles.productImage}
              onError={(e) => {
                // Final fallback - hide image and show placeholder
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className={styles.placeholderImage} style={{ display: 'none' }}>
              <span className={styles.placeholderIcon}>📦</span>
              <span className={styles.placeholderText}>No Image</span>
            </div>
          </>
        ) : (
          <div className={styles.placeholderImage}>
            <span className={styles.placeholderIcon}>📦</span>
            <span className={styles.placeholderText}>No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName} title={product.name}>
          {product.name}
        </h3>
        
        <div className={styles.productPrice}>
          {formatPrice(product.price)}
        </div>

        {/* Sales Count */}
        <div className={styles.salesCount}>
          Đã bán: {product.soldCount || 0}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;