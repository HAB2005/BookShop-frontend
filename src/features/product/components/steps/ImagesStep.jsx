import { useState, useRef } from 'react';
import { Button } from '../../../../shared/ui/button.jsx';
import styles from './ImagesStep.module.css';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

function ImagesStep({ 
  formData, 
  errors, 
  onAddImage, 
  onRemoveImage, 
  onSetPrimaryImage, 
  onReorderImages 
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, WebP)';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleFileSelect = (files) => {
    setUploadError('');
    
    Array.from(files).forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      
      // Set first image as primary if no images exist
      const isPrimary = formData.images.length === 0 && index === 0;
      onAddImage(file, isPrimary);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (imageId) => {
    onRemoveImage(imageId);
    setUploadError('');
  };

  const handleSetPrimary = (imageId) => {
    onSetPrimaryImage(imageId);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.imagesStep}>
      <div className={styles.stepHeader}>
        <h2>Product Images</h2>
        {formData.images.length > 0 && (
          <span className={styles.imageCount}>{formData.images.length} image(s)</span>
        )}
      </div>

      {/* Upload Area */}
      <div className={styles.uploadSection}>
        <div
          className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className={styles.hiddenInput}
          />
          
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>📸</div>
            <h3>Upload Images</h3>
            <p>Drag & drop or click to browse</p>
            <div className={styles.uploadSpecs}>
              Max 5MB • JPEG, PNG, GIF, WebP
            </div>
          </div>
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className={styles.uploadError}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Images Grid */}
      {formData.images.length > 0 && (
        <div className={styles.imagesSection}>
          <div className={styles.sectionHeader}>
            <h3>Uploaded Images</h3>
            <p>Click on an image to set it as primary. Primary image will be shown first.</p>
          </div>

          <div className={styles.imagesGrid}>
            {formData.images.map((image, index) => (
              <div
                key={image.id}
                className={`${styles.imageCard} ${image.isPrimary ? styles.primary : ''}`}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={image.preview}
                    alt={`Product image ${index + 1}`}
                    className={styles.imagePreview}
                    onClick={() => handleSetPrimary(image.id)}
                  />
                  
                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className={styles.primaryBadge}>
                      <span>Primary</span>
                    </div>
                  )}
                  
                  {/* Image Actions */}
                  <div className={styles.imageActions}>
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(image.id);
                        }}
                        className={styles.setPrimaryButton}
                        title="Set as primary"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id);
                      }}
                      className={styles.removeButton}
                      title="Remove"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className={styles.imageInfo}>
                  <div className={styles.imageName}>
                    {image.file.name}
                  </div>
                  <div className={styles.imageSize}>
                    {formatFileSize(image.file.size)}
                  </div>
                  {image.isPrimary && (
                    <div className={styles.primaryLabel}>Primary Image</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Images State */}
      {formData.images.length === 0 && (
        <div className={styles.noImagesState}>
          <div className={styles.noImagesIcon}>🖼️</div>
          <h3>No images added</h3>
          <p>Images help customers understand your product better. Add some high-quality photos!</p>
        </div>
      )}

      {/* Error Display */}
      {errors.images && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{errors.images}</span>
        </div>
      )}

      {/* Quick Tips */}
      {formData.images.length > 0 && (
        <div className={styles.tipsSection}>
          <h4>💡 Tips</h4>
          <ul>
            <li>The primary image will be displayed first in product listings</li>
            <li>You can reorder images by setting different ones as primary</li>
            <li>Use high-quality, well-lit photos for best results</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImagesStep;