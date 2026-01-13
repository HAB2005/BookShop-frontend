import { useState } from 'react';
import styles from './ProductDetailsStep.module.css';

const PRODUCT_TYPES = [
  {
    id: 'general',
    label: 'General Product',
    description: 'Standard product without specific type requirements',
    icon: '📦'
  },
  {
    id: 'book',
    label: 'Book',
    description: 'Books, magazines, and other publications',
    icon: '📚'
  }
];

const LANGUAGES = [
  'Vietnamese',
  'English',
  'French',
  'German',
  'Spanish',
  'Chinese',
  'Japanese',
  'Korean',
  'Other'
];

function ProductDetailsStep({ 
  formData, 
  errors, 
  onUpdateFormData, 
  onUpdateBookData 
}) {
  const [touched, setTouched] = useState({});

  const handleProductTypeChange = (productType) => {
    onUpdateFormData({ productType });
    
    // Reset book data if switching away from book
    if (productType !== 'book') {
      onUpdateBookData({
        isbn: '',
        description: '',
        publishYear: '',
        pageCount: '',
        language: 'Vietnamese'
      });
    }
  };

  const handleBookFieldChange = (field, value) => {
    onUpdateBookData({ [field]: value });
    
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

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1000; year--) {
    yearOptions.push(year);
  }

  return (
    <div className={styles.productDetailsStep}>
      <div className={styles.stepHeader}>
        <h2>Product Details</h2>
        <p>Specify the type of product and provide additional details</p>
      </div>

      {/* Product Type Selection */}
      <div className={styles.productTypeSection}>
        <h3>Product Type</h3>
        <div className={styles.productTypeGrid}>
          {PRODUCT_TYPES.map(type => (
            <div
              key={type.id}
              className={`${styles.productTypeCard} ${
                formData.productType === type.id ? styles.selected : ''
              }`}
              onClick={() => handleProductTypeChange(type.id)}
            >
              <div className={styles.typeIcon}>{type.icon}</div>
              <div className={styles.typeContent}>
                <h4>{type.label}</h4>
                <p>{type.description}</p>
              </div>
              {formData.productType === type.id && (
                <div className={styles.selectedIndicator}>✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Book Details Section */}
      {formData.productType === 'book' && (
        <div className={styles.bookDetailsSection}>
          <h3>Book Information</h3>
          <p className={styles.sectionDescription}>
            Provide additional details specific to books and publications
          </p>

          <div className={styles.formGrid}>
            {/* ISBN */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="isbn">
                ISBN
              </label>
              <input
                id="isbn"
                type="text"
                className={`${styles.input} ${getFieldError('isbn') ? styles.inputError : ''}`}
                placeholder="978-0-123456-78-9"
                value={formData.book.isbn}
                onChange={(e) => handleBookFieldChange('isbn', e.target.value)}
                onBlur={() => handleBlur('isbn')}
                maxLength={20}
              />
              <div className={styles.fieldFooter}>
                {getFieldError('isbn') && (
                  <span className={styles.errorMessage}>{getFieldError('isbn')}</span>
                )}
                <span className={styles.charCount}>
                  {formData.book.isbn.length}/20
                </span>
              </div>
              <div className={styles.fieldHint}>
                International Standard Book Number (optional)
              </div>
            </div>

            {/* Language */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="language">
                Language
              </label>
              <select
                id="language"
                className={`${styles.select} ${getFieldError('language') ? styles.inputError : ''}`}
                value={formData.book.language}
                onChange={(e) => handleBookFieldChange('language', e.target.value)}
                onBlur={() => handleBlur('language')}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              {getFieldError('language') && (
                <span className={styles.errorMessage}>{getFieldError('language')}</span>
              )}
              <div className={styles.fieldHint}>
                Primary language of the book content
              </div>
            </div>

            {/* Publish Year */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="publishYear">
                Publication Year
              </label>
              <select
                id="publishYear"
                className={`${styles.select} ${getFieldError('publishYear') ? styles.inputError : ''}`}
                value={formData.book.publishYear}
                onChange={(e) => handleBookFieldChange('publishYear', e.target.value)}
                onBlur={() => handleBlur('publishYear')}
              >
                <option value="">Select year...</option>
                {yearOptions.slice(0, 50).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {getFieldError('publishYear') && (
                <span className={styles.errorMessage}>{getFieldError('publishYear')}</span>
              )}
              <div className={styles.fieldHint}>
                Year when the book was published
              </div>
            </div>

            {/* Page Count */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pageCount">
                Page Count
              </label>
              <input
                id="pageCount"
                type="number"
                className={`${styles.input} ${getFieldError('pageCount') ? styles.inputError : ''}`}
                placeholder="0"
                value={formData.book.pageCount}
                onChange={(e) => handleBookFieldChange('pageCount', e.target.value)}
                onBlur={() => handleBlur('pageCount')}
                min="1"
                max="10000"
              />
              {getFieldError('pageCount') && (
                <span className={styles.errorMessage}>{getFieldError('pageCount')}</span>
              )}
              <div className={styles.fieldHint}>
                Total number of pages in the book
              </div>
            </div>

            {/* Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className={`${styles.textarea} ${getFieldError('description') ? styles.inputError : ''}`}
                placeholder="Enter a detailed description of the book..."
                value={formData.book.description}
                onChange={(e) => handleBookFieldChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                rows={4}
                maxLength={1000}
              />
              <div className={styles.fieldFooter}>
                {getFieldError('description') && (
                  <span className={styles.errorMessage}>{getFieldError('description')}</span>
                )}
                <span className={styles.charCount}>
                  {formData.book.description.length}/1000
                </span>
              </div>
              <div className={styles.fieldHint}>
                Provide a compelling description that highlights key features, plot, or content
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Product Message */}
      {formData.productType === 'general' && (
        <div className={styles.generalProductMessage}>
          <div className={styles.messageCard}>
            <div className={styles.messageIcon}>📦</div>
            <div className={styles.messageContent}>
              <h4>General Product Selected</h4>
              <p>
                You've selected a general product type. No additional details are required 
                for this step. You can proceed to add images or review your product information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className={styles.stepSummary}>
        <h4>Summary</h4>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Product Type:</span>
            <span className={styles.summaryValue}>
              {PRODUCT_TYPES.find(type => type.id === formData.productType)?.label || 'Not selected'}
            </span>
          </div>
          
          {formData.productType === 'book' && (
            <>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>ISBN:</span>
                <span className={styles.summaryValue}>
                  {formData.book.isbn || 'Not specified'}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Language:</span>
                <span className={styles.summaryValue}>
                  {formData.book.language || 'Not specified'}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Publication Year:</span>
                <span className={styles.summaryValue}>
                  {formData.book.publishYear || 'Not specified'}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Pages:</span>
                <span className={styles.summaryValue}>
                  {formData.book.pageCount || 'Not specified'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className={styles.tipsSection}>
        <h4>💡 Product Details Tips</h4>
        <ul className={styles.tipsList}>
          <li>Choose the product type that best matches your item</li>
          <li>For books, ISBN helps with identification and cataloging</li>
          <li>Detailed descriptions improve customer understanding</li>
          <li>All book fields are optional but recommended for better listings</li>
        </ul>
      </div>
    </div>
  );
}

export default ProductDetailsStep;