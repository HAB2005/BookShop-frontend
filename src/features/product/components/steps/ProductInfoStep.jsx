import { useState, useMemo } from 'react';
import LoadingSpinner from '../../../../shared/ui/LoadingSpinner.jsx';
import styles from './ProductInfoStep.module.css';

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

function ProductInfoStep({ 
  formData, 
  errors, 
  categories, 
  loadingCategories, 
  onUpdateFormData,
  onUpdateBookData,
  onToggleCategory 
}) {
  const [touched, setTouched] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const handleInputChange = (field, value) => {
    onUpdateFormData({ [field]: value });
    
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleBookFieldChange = (field, value) => {
    onUpdateBookData({ [field]: value });
    
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

  const handleCategoryToggle = (categoryId) => {
    onToggleCategory(categoryId);
  };

  const isCategorySelected = (categoryId) => {
    return formData.categoryIds.includes(categoryId);
  };

  // Filter and organize categories
  const filteredCategories = useMemo(() => {
    let filtered = categories || [];

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showOnlySelected) {
      filtered = filtered.filter(category =>
        formData.categoryIds.includes(category.categoryId)
      );
    }

    const parentCategories = filtered.filter(cat => !cat.parentId);
    const childCategories = filtered.filter(cat => cat.parentId);

    return {
      parents: parentCategories,
      children: childCategories,
      all: filtered
    };
  }, [categories, searchTerm, showOnlySelected, formData.categoryIds]);

  const getChildCategories = (parentId) => {
    return filteredCategories.children.filter(cat => cat.parentId === parentId);
  };

  const selectedCount = formData.categoryIds.length;
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year >= 1000; year--) {
    yearOptions.push(year);
  }

  if (loadingCategories) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className={styles.productInfoStep}>
      <div className={styles.stepHeader}>
        <h2>Product Information</h2>
      </div>

      <div className={styles.formLayout}>
        {/* Left Column - Basic Info & Product Type */}
        <div className={styles.leftColumn}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h3>Basic Details</h3>
            
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

            <div className={styles.formRow}>
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
          </div>

          {/* Product Type */}
          <div className={styles.section}>
            <h3>Book Details</h3>
            
            <div className={styles.formRow}>
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
                {getFieldError('isbn') && (
                  <span className={styles.errorMessage}>{getFieldError('isbn')}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  className={`${styles.select} ${getFieldError('language') ? styles.inputError : ''}`}
                  value={formData.book.language}
                  onChange={(e) => handleBookFieldChange('language', e.target.value)}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="publishYear">
                  Publication Year
                </label>
                <select
                  id="publishYear"
                  className={`${styles.select} ${getFieldError('publishYear') ? styles.inputError : ''}`}
                  value={formData.book.publishYear}
                  onChange={(e) => handleBookFieldChange('publishYear', e.target.value)}
                >
                  <option value="">Select year...</option>
                  {yearOptions.slice(0, 50).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

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
                  min="1"
                  max="10000"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className={`${styles.textarea} ${getFieldError('description') ? styles.inputError : ''}`}
                placeholder="Enter book description..."
                value={formData.book.description}
                onChange={(e) => handleBookFieldChange('description', e.target.value)}
                rows={4}
              />
              <div className={styles.fieldFooter}>
                {getFieldError('description') && (
                  <span className={styles.errorMessage}>{getFieldError('description')}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Categories */}
        <div className={styles.rightColumn}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Categories</h3>
              {selectedCount > 0 && (
                <span className={styles.selectedCount}>{selectedCount} selected</span>
              )}
            </div>

            {/* Search and Filter */}
            <div className={styles.controlsSection}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>

              <div className={styles.filterControls}>
                <label className={styles.filterLabel}>
                  <input
                    type="checkbox"
                    checked={showOnlySelected}
                    onChange={(e) => setShowOnlySelected(e.target.checked)}
                    className={styles.filterCheckbox}
                  />
                  <span>Selected only</span>
                </label>
              </div>
            </div>

            {/* Selected Categories */}
            {selectedCount > 0 && (
              <div className={styles.selectedTags}>
                {formData.categoryIds.map(categoryId => {
                  const category = categories.find(cat => cat.categoryId === categoryId);
                  return category ? (
                    <span key={categoryId} className={styles.selectedTag}>
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(categoryId)}
                        className={styles.removeTag}
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Categories List */}
            <div className={styles.categoriesContainer}>
              {filteredCategories.all.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📂</div>
                  <h4>No categories found</h4>
                  <p>
                    {searchTerm 
                      ? `No categories match "${searchTerm}"`
                      : 'No categories available'
                    }
                  </p>
                </div>
              ) : (
                <div className={styles.categoriesList}>
                  {filteredCategories.parents.map(category => (
                    <div key={category.categoryId} className={styles.categoryGroup}>
                      <div
                        className={`${styles.categoryItem} ${styles.parentCategory} ${
                          isCategorySelected(category.categoryId) ? styles.selected : ''
                        }`}
                        onClick={() => handleCategoryToggle(category.categoryId)}
                      >
                        <div className={styles.categoryContent}>
                          <div className={styles.categoryInfo}>
                            <span className={styles.categoryIcon}>📁</span>
                            <span className={styles.categoryName}>{category.name}</span>
                          </div>
                          <div className={styles.categoryActions}>
                            {isCategorySelected(category.categoryId) && (
                              <span className={styles.selectedIcon}>✓</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {getChildCategories(category.categoryId).map(childCategory => (
                        <div
                          key={childCategory.categoryId}
                          className={`${styles.categoryItem} ${styles.childCategory} ${
                            isCategorySelected(childCategory.categoryId) ? styles.selected : ''
                          }`}
                          onClick={() => handleCategoryToggle(childCategory.categoryId)}
                        >
                          <div className={styles.categoryContent}>
                            <div className={styles.categoryInfo}>
                              <span className={styles.categoryIcon}>📄</span>
                              <span className={styles.categoryName}>{childCategory.name}</span>
                            </div>
                            <div className={styles.categoryActions}>
                              {isCategorySelected(childCategory.categoryId) && (
                                <span className={styles.selectedIcon}>✓</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {filteredCategories.children
                    .filter(child => !filteredCategories.parents.some(parent => parent.categoryId === child.parentId))
                    .map(category => (
                      <div
                        key={category.categoryId}
                        className={`${styles.categoryItem} ${styles.orphanCategory} ${
                          isCategorySelected(category.categoryId) ? styles.selected : ''
                        }`}
                        onClick={() => handleCategoryToggle(category.categoryId)}
                      >
                        <div className={styles.categoryContent}>
                          <div className={styles.categoryInfo}>
                            <span className={styles.categoryIcon}>📄</span>
                            <span className={styles.categoryName}>{category.name}</span>
                          </div>
                          <div className={styles.categoryActions}>
                            {isCategorySelected(category.categoryId) && (
                              <span className={styles.selectedIcon}>✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Error Display */}
            {errors.categories && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                <span>{errors.categories}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Preview */}
      {formData.price && !isNaN(formData.price) && parseFloat(formData.price) > 0 && (
        <div className={styles.pricePreview}>
          <div className={styles.previewCard}>
            <h4>Price Preview</h4>
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

export default ProductInfoStep;