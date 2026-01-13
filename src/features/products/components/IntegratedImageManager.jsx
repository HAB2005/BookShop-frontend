import { useState, useEffect } from 'react';
import { 
  getProductImagesApi, 
  uploadProductImageApi, 
  setPrimaryImageApi, 
  deleteProductImageApi 
} from '../api/products.api.js';
import { useToastContext } from '../../../app/providers.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ConfirmationModal from '../../../shared/ui/ConfirmationModal.jsx';
import styles from './IntegratedImageManager.module.css';

function IntegratedImageManager({ productId, onImagesChange, showTitle = true }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const { success, error: showError } = useToastContext();

  useEffect(() => {
    if (productId) {
      fetchImages();
    }
  }, [productId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductImagesApi(productId);
      const imageList = response || [];
      setImages(imageList);
      if (onImagesChange) {
        onImagesChange(imageList);
      }
    } catch (err) {
      setError('Failed to load images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} is not a valid image file`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          showError(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        await uploadProductImageApi(productId, file, images.length === 0);
      }

      success(`${files.length} image(s) uploaded successfully`);
      await fetchImages();
      event.target.value = '';
    } catch (err) {
      showError('Failed to upload images');
      console.error('Error uploading images:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      setLoading(true);
      await setPrimaryImageApi(imageId);
      success('Primary image updated');
      await fetchImages();
    } catch (err) {
      showError('Failed to set primary image');
      console.error('Error setting primary image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (image) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      setLoading(true);
      await deleteProductImageApi(imageToDelete.imageId);
      success('Image deleted successfully');
      await fetchImages();
      setShowDeleteModal(false);
      setImageToDelete(null);
    } catch (err) {
      showError('Failed to delete image');
      console.error('Error deleting image:', err);
    } finally {
      setLoading(false);
    }
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

  const getPrimaryImage = () => {
    return images.find(img => img.isPrimary) || images[0];
  };

  const primaryImage = getPrimaryImage();
  const primaryImageUrl = getImageUrl(primaryImage);

  return (
    <div className={styles.imageManager}>
      {showTitle && (
        <div className={styles.header}>
          <h3 className={styles.title}>Product Images</h3>
          <div className={styles.imageCount}>
            {images.length} image{images.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
          <button onClick={fetchImages} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {/* Primary Image Display */}
      <div className={styles.primaryImageSection}>
        <div className={styles.primaryImageContainer}>
          {primaryImageUrl ? (
            <>
              <img
                src={primaryImageUrl}
                alt="Primary product image"
                className={styles.primaryImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                <div className={styles.placeholderIcon}>📦</div>
                <span className={styles.placeholderText}>No Image</span>
              </div>
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              <div className={styles.placeholderIcon}>📦</div>
              <span className={styles.placeholderText}>No Image</span>
            </div>
          )}
          
          {primaryImage && (
            <div className={styles.primaryBadge}>
              <span className={styles.primaryIcon}>⭐</span>
              Primary
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className={styles.uploadSection}>
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className={styles.fileInput}
            disabled={uploading}
          />
          <label 
            htmlFor="imageUpload" 
            className={`${styles.uploadButton} ${uploading ? styles.uploading : ''}`}
          >
            {uploading ? (
              <>
                <LoadingSpinner size="small" />
                Uploading...
              </>
            ) : (
              <>
                <span className={styles.uploadIcon}>📷</span>
                Add Images
              </>
            )}
          </label>
        </div>
      </div>

      {/* All Images Grid */}
      {images.length > 0 && (
        <div className={styles.allImagesSection}>
          <div className={styles.sectionTitle}>All Images ({images.length})</div>
          <div className={styles.imageGrid}>
            {images.map((image) => (
              <div key={image.imageId} className={styles.imageCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={getImageUrl(image)}
                    alt={`Product image ${image.displayOrder || ''}`}
                    className={styles.image}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  
                  {image.isPrimary && (
                    <div className={styles.primaryBadgeSmall}>
                      <span className={styles.primaryIcon}>⭐</span>
                    </div>
                  )}
                  
                  <div className={styles.imageOverlay}>
                    <div className={styles.imageActions}>
                      {!image.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(image.imageId)}
                          className={styles.actionButton}
                          title="Set as primary image"
                          disabled={loading}
                        >
                          ⭐
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteImage(image)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Delete image"
                        disabled={loading}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className={styles.imageInfo}>
                  <div className={styles.imageOrder}>#{image.displayOrder || 'N/A'}</div>
                  <div className={styles.imageSize}>
                    {image.fileSize ? `${(image.fileSize / 1024).toFixed(1)} KB` : 'Unknown'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default IntegratedImageManager;