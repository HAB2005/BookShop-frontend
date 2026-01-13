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
        <p>Upload high-quality images to showcase your product</p>
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
            <h3>Upload Product Images</h3>
            <p>Drag and drop images here, or click to browse</p>
            <div className={styles.uploadSpecs}>
              <span>• Max 5MB per image</span>
              <span>• JPEG, PNG, GIF, WebP supported</span>
              <span>• Multiple images allowed</span>
            </div>
            <Button
              variant="outline"
              onClick={handleBrowseClick}
              className={styles.browseButton}
            >
              Browse Files
            </Button>
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
            <h3>Uploaded Images ({formData.images.length})</h3>
            <p>Click on an image to set it as the primary image</p>
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
                        onClick={() => handleSetPrimary(image.id)}
                        className={styles.setPrimaryButton}
                        title="Set as primary image"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className={styles.removeButton}
                      title="Remove image"
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
          <h3>No Images Added Yet</h3>
          <p>
            Images help customers understand your product better. 
            While optional, we recommend adding at least one high-quality image.
          </p>
        </div>
      )}

      {/* Error Display */}
      {errors.images && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{errors.images}</span>
        </div>
      )}

      {/* Image Guidelines */}
      <div className={styles.guidelinesSection}>
        <h4>📋 Image Guidelines</h4>
        <div className={styles.guidelinesGrid}>
          <div className={styles.guidelineItem}>
            <div className={styles.guidelineIcon}>✅</div>
            <div className={styles.guidelineContent}>
              <h5>High Quality</h5>
              <p>Use clear, well-lit photos with good resolution</p>
            </div>
          </div>
          
          <div className={styles.guidelineItem}>
            <div className={styles.guidelineIcon}>📐</div>
            <div className={styles.guidelineContent}>
              <h5>Square Format</h5>
              <p>Square images (1:1 ratio) work best for product listings</p>
            </div>
          </div>
          
          <div className={styles.guidelineItem}>
            <div className={styles.guidelineIcon}>🎯</div>
            <div className={styles.guidelineContent}>
              <h5>Multiple Angles</h5>
              <p>Show different views and important details</p>
            </div>
          </div>
          
          <div className={styles.guidelineItem}>
            <div className={styles.guidelineIcon}>🏷️</div>
            <div className={styles.guidelineContent}>
              <h5>Primary Image</h5>
              <p>Choose your best image as the primary (main) image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={styles.tipsSection}>
        <h4>💡 Image Upload Tips</h4>
        <ul className={styles.tipsList}>
          <li>The first image you upload will automatically be set as primary</li>
          <li>Click on any image to make it the primary image</li>
          <li>You can upload multiple images at once</li>
          <li>Images are processed and optimized automatically</li>
          <li>Remove unwanted images by clicking the trash icon</li>
        </ul>
      </div>
    </div>
  );
}

export default ImagesStep;