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
import styles from './ProductImageManager.module.css';

function ProductImageManager({ productId, onImagesChange }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const { success, error: showError } = useToastContext();

  // Fetch images on mount
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
      setImages(response || []);
      if (onImagesChange) {
        onImagesChange(response || []);
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
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          showError(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        await uploadProductImageApi(productId, file, images.length === 0);
      }

      success(`${files.length} image(s) uploaded successfully`);
      await fetchImages();

      // Clear the input
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

    // Handle different possible image data structures
    let filename = image.imageUrl || image.filename || image.url;

    if (!filename) return null;

    // If filename already contains full URL, return as is
    if (filename.startsWith('http')) {
      return filename;
    }

    // If filename already starts with 'products/', it's already a relative path from files root
    if (filename.startsWith('products/')) {
      return `${baseUrl}/files/${filename}`;
    }

    // Remove leading slash if present
    const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;

    // Build the full URL with products path
    return `${baseUrl}/files/products/${productId}/${cleanFilename}`;
  };

  if (loading && images.length === 0) {
    return (
      <div className={styles.imageManager}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.imageManager}>
      <div className={styles.header}>
        <h3 className={styles.title}>Product Images</h3>
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

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
          <button onClick={fetchImages} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      <div className={styles.imageGrid}>
        {images.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🖼️</div>
            <p>No images uploaded yet</p>
            <p className={styles.emptySubtext}>Upload images to showcase your product</p>
          </div>
        ) : (
          images.map((image) => (
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
                  <div className={styles.primaryBadge}>
                    <span className={styles.primaryIcon}>⭐</span>
                    Primary
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
                <div className={styles.imageOrder}>
                  Order: {image.displayOrder || 'N/A'}
                </div>
                <div className={styles.imageSize}>
                  {image.fileSize ? `${(image.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {loading && images.length > 0 && (
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
        message={
          imageToDelete
            ? `Are you sure you want to delete this image? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default ProductImageManager;