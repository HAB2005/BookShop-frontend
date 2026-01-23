import { useState } from 'react';
import styles from './BasicInfoStep.module.css';

function BasicInfoStep({ formData, errors, onUpdateFormData }) {
  const [touched, setTouched] = useState({});

  const handleInputChange = (field, value) => {
    onUpdateFormData({ [field]: value });
    
    // Mark field as touched
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  return (
    <div className={styles.basicInfoStep}>
      <div className={styles.stepHeader}>
        <h2>Basic Information</h2>
      </div>

      <div className={styles.formGrid}>
        {/* Product Name */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="productName">
            Product Name <span className={styles.required}>*</span>
          </label>
          <input
            id="productName"
            type="text"
            className={`${styles.input} ${getFieldError('name') ? styles.inputError : ''}`}
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            maxLength={100}
          />
          <div className={styles.fieldFooter}>
            {getFieldError('name') && (
              <span className={styles.errorMessage}>{getFieldError('name')}</span>
            )}
            <span className={styles.charCount}>
              {formData.name.length}/100
            </span>
          </div>
        </div>

        {/* Product Price */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="productPrice">
            Price (VND) <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>₫</span>
            <input
              id="productPrice"
              type="number"
              className={`${styles.input} ${styles.inputWithPrefix} ${getFieldError('price') ? styles.inputError : ''}`}
              placeholder="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
              min="0"
              step="1000"
            />
          </div>
          {getFieldError('price') && (
            <span className={styles.errorMessage}>{getFieldError('price')}</span>
          )}
        </div>

        {/* Product Status */}
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="productStatus">
            Status
          </label>
          <select
            id="productStatus"
            className={styles.select}
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Price Preview */}
      {formData.price && !isNaN(formData.price) && parseFloat(formData.price) > 0 && (
        <div className={styles.pricePreview}>
          <div className={styles.previewCard}>
            <h4>Preview</h4>
            <div className={styles.priceDisplay}>
              <span className={styles.priceAmount}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(parseFloat(formData.price))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicInfoStep;