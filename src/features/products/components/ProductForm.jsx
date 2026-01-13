import { useState, useEffect } from 'react';
import styles from './ProductForm.module.css';

function ProductForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  onChange,
  onFormDataChange,
  loading = false,
  mode = 'create', // 'create' or 'edit'
  hideActions = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    book: {
      isbn: '',
      description: '',
      publishYear: '',
      pageCount: '',
      language: ''
    }
  });
  const [isBookProduct, setIsBookProduct] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      const newFormData = {
        name: initialData.name || '',
        price: initialData.price?.toString() || '',
        book: {
          isbn: initialData.book?.isbn || '',
          description: initialData.book?.description || '',
          publishYear: initialData.book?.publishYear?.toString() || '',
          pageCount: initialData.book?.pageCount?.toString() || '',
          language: initialData.book?.language || ''
        }
      };
      setFormData(newFormData);
      setIsBookProduct(!!initialData.book);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Notify parent of changes
    if (onChange) {
      onChange();
    }
    if (onFormDataChange) {
      onFormDataChange(newFormData, isBookProduct);
    }
  };

  const handleBookInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      book: {
        ...formData.book,
        [name]: value
      }
    };
    setFormData(newFormData);
    
    // Clear error when user starts typing
    if (errors[`book.${name}`]) {
      setErrors(prev => ({ ...prev, [`book.${name}`]: null }));
    }
    
    // Notify parent of changes
    if (onChange) {
      onChange();
    }
    if (onFormDataChange) {
      onFormDataChange(newFormData, isBookProduct);
    }
  };

  const handleBookToggle = (e) => {
    const newIsBookProduct = e.target.checked;
    setIsBookProduct(newIsBookProduct);
    
    // Notify parent of changes
    if (onChange) {
      onChange();
    }
    if (onFormDataChange) {
      onFormDataChange(formData, newIsBookProduct);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Product name must not exceed 100 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    // Book validation if it's a book product
    if (isBookProduct) {
      if (formData.book.isbn && formData.book.isbn.length > 20) {
        newErrors['book.isbn'] = 'ISBN must not exceed 20 characters';
      }
      if (formData.book.publishYear && (isNaN(formData.book.publishYear) || parseInt(formData.book.publishYear) < 1)) {
        newErrors['book.publishYear'] = 'Publish year must be a positive number';
      }
      if (formData.book.pageCount && (isNaN(formData.book.pageCount) || parseInt(formData.book.pageCount) < 1)) {
        newErrors['book.pageCount'] = 'Page count must be a positive number';
      }
      if (formData.book.language && formData.book.language.length > 50) {
        newErrors['book.language'] = 'Language must not exceed 50 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price)
    };

    // Add book data if it's a book product and has any book fields filled
    if (isBookProduct) {
      const bookData = {};
      if (formData.book.isbn) bookData.isbn = formData.book.isbn.trim();
      if (formData.book.description) bookData.description = formData.book.description.trim();
      if (formData.book.publishYear) bookData.publishYear = parseInt(formData.book.publishYear);
      if (formData.book.pageCount) bookData.pageCount = parseInt(formData.book.pageCount);
      if (formData.book.language) bookData.language = formData.book.language.trim();
      
      if (Object.keys(bookData).length > 0) {
        submitData.book = bookData;
      }
    }

    onSubmit(submitData);
  };

  return (
    <div className={styles.productForm}>
      <form onSubmit={handleSubmit}>
        {/* Basic Product Information */}
        <div className={styles.basicSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📝</div>
            <div>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <p className={styles.sectionDescription}>Essential product details</p>
            </div>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Product Name
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  placeholder="Enter product name"
                  maxLength={100}
                />
                <div className={styles.inputIcon}>🏷️</div>
              </div>
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`${styles.input} ${styles.priceInput} ${errors.price ? styles.error : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <div className={styles.inputIcon}>💰</div>
                <div className={styles.currencyLabel}>VND</div>
              </div>
              {errors.price && <span className={styles.errorText}>{errors.price}</span>}
            </div>
          </div>
        </div>

        {/* Book Product Toggle */}
        <div className={styles.toggleSection}>
          <div className={styles.toggleWrapper}>
            <div className={styles.toggleContent}>
              <div className={styles.toggleIcon}>📚</div>
              <div className={styles.toggleInfo}>
                <h4 className={styles.toggleTitle}>Book Product</h4>
                <p className={styles.toggleDescription}>Enable additional book-specific fields</p>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isBookProduct}
                onChange={handleBookToggle}
                className={styles.switchInput}
              />
              <span className={styles.switchSlider}></span>
            </label>
          </div>
        </div>

        {/* Book Information */}
        {isBookProduct && (
          <div className={styles.bookSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>📖</div>
              <div>
                <h3 className={styles.sectionTitle}>Book Information</h3>
                <p className={styles.sectionDescription}>Additional details for book products</p>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="isbn" className={styles.label}>ISBN</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.book.isbn}
                    onChange={handleBookInputChange}
                    className={`${styles.input} ${errors['book.isbn'] ? styles.error : ''}`}
                    placeholder="978-0-123456-78-9"
                    maxLength={20}
                  />
                  <div className={styles.inputIcon}>🔢</div>
                </div>
                {errors['book.isbn'] && <span className={styles.errorText}>{errors['book.isbn']}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="language" className={styles.label}>Language</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    value={formData.book.language}
                    onChange={handleBookInputChange}
                    className={`${styles.input} ${errors['book.language'] ? styles.error : ''}`}
                    placeholder="English, Vietnamese..."
                    maxLength={50}
                  />
                  <div className={styles.inputIcon}>🌐</div>
                </div>
                {errors['book.language'] && <span className={styles.errorText}>{errors['book.language']}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="publishYear" className={styles.label}>Publish Year</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="publishYear"
                    name="publishYear"
                    value={formData.book.publishYear}
                    onChange={handleBookInputChange}
                    className={`${styles.input} ${errors['book.publishYear'] ? styles.error : ''}`}
                    placeholder="2023"
                    min="1"
                  />
                  <div className={styles.inputIcon}>📅</div>
                </div>
                {errors['book.publishYear'] && <span className={styles.errorText}>{errors['book.publishYear']}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pageCount" className={styles.label}>Page Count</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="pageCount"
                    name="pageCount"
                    value={formData.book.pageCount}
                    onChange={handleBookInputChange}
                    className={`${styles.input} ${errors['book.pageCount'] ? styles.error : ''}`}
                    placeholder="300"
                    min="1"
                  />
                  <div className={styles.inputIcon}>📄</div>
                </div>
                {errors['book.pageCount'] && <span className={styles.errorText}>{errors['book.pageCount']}</span>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Description</label>
              <div className={styles.textareaWrapper}>
                <textarea
                  id="description"
                  name="description"
                  value={formData.book.description}
                  onChange={handleBookInputChange}
                  className={styles.textarea}
                  placeholder="Enter book description..."
                  rows={4}
                />
                <div className={styles.textareaIcon}>📝</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        {!hideActions && (
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              <span className={styles.buttonIcon}>❌</span>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <span className={styles.buttonIcon}>
                {loading ? '⏳' : (mode === 'edit' ? '💾' : '➕')}
              </span>
              {loading ? 'Saving...' : (mode === 'edit' ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProductForm;