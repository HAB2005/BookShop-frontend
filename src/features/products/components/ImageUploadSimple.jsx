import { useState } from 'react';
import { uploadProductImageApi } from '../api/products.api.js';
import styles from './ImageUploadSimple.module.css';

function ImageUploadSimple({ productId, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);

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
      await uploadProductImageApi(productId, file, true); // Set as primary
      if (onImageUploaded) {
        onImageUploaded();
      }
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <div className={styles.imageUpload}>
      <label className={styles.uploadButton}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className={styles.fileInput}
        />
        {uploading ? 'Uploading...' : '📷 Upload Image'}
      </label>
    </div>
  );
}

export default ImageUploadSimple;