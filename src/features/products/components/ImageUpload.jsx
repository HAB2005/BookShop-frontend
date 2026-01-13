import { useState, useEffect } from 'react';
import { uploadProductImageApi, getProductImagesApi, setPrimaryImageApi, deleteProductImageApi } from '../api/products.api.js';
import { FILE } from '../../../api/endpoints.js';
import styles from './ImageUpload.module.css';

function ImageUpload({ productId, onImagesChange }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchImages();
    }
  }, [productId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await getProductImagesApi(productId);
      setImages(response || []);
      if (onImagesChange) {
        onImagesChange(response || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      await uploadProductImageApi(productId, file);
      await fetchImages(); // Refresh images list
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setPrimaryImageApi(imageId);
      await fetchImages(); // Refresh to show updated primary status
    } catch (error) {
      console.error('Failed to set primary image:', error);
      alert('Failed to set primary image. Please try again.');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteProductImageApi(imageId);
      await fetchImages(); // Refresh images list
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const getImageUrl = (image) => {
    if (image.url) {
      return image.url;
    }
    // Construct URL using FILE endpoint
    return FILE.SERVE(productId, image.filename);
  };

  if (loading) {
    return (
      <div className={styles.imageUpload}>
        <div className={styles.loading}>Loading images...</div>
      </div>
    );
  }

  return (
    <div className={styles.imageUpload}>
      <div className={styles.header}>
        <h4 className={styles.title}>Product Images</h4>
        <label className={styles.uploadButton}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className={styles.fileInput}
          />
          {uploading ? 'Uploading...' : '+ Add Image'}
        </label>
      </div>

      <div className={styles.imageGrid}>
        {images.map((image) => (
          <div key={image.imageId} className={styles.imageItem}>
            <div className={styles.imageContainer}>
              <img
                src={getImageUrl(image)}
                alt={`Product image ${image.imageId}`}
                className={styles.image}
                onError={(e) => {
                  e.target.src = '/placeholder-image.png'; // Fallback image
                }}
              />
              
              {image.isPrimary && (
                <div className={styles.primaryBadge}>Primary</div>
              )}
              
              <div className={styles.imageActions}>
                {!image.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(image.imageId)}
                    className={styles.primaryButton}
                    title="Set as primary image"
                  >
                    ⭐
                  </button>
                )}
                <button
                  onClick={() => handleDeleteImage(image.imageId)}
                  className={styles.deleteButton}
                  title="Delete image"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📷</div>
            <p>No images uploaded yet</p>
            <p className={styles.emptyHint}>Click "Add Image" to upload your first image</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;