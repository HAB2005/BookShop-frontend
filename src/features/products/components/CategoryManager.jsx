import { useState, useEffect } from 'react';
import { assignCategoriesToProductApi } from '../api/products.api.js';
import { getCategoriesApi } from '../api/categories.api.js';
import { useToastContext } from '../../../app/providers.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import styles from './CategoryManager.module.css';

function CategoryManager({ productId, currentCategories = [], onCategoriesChange }) {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToastContext();

  // Initialize selected categories
  useEffect(() => {
    if (currentCategories) {
      setSelectedCategories(currentCategories.map(cat => cat.categoryId));
    }
  }, [currentCategories]);

  // Fetch available categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCategoriesApi();
      setAvailableCategories(response.content || response || []);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSaveCategories = async () => {
    try {
      setSaving(true);
      await assignCategoriesToProductApi(productId, selectedCategories);
      
      // Update the parent component with new categories
      const updatedCategories = availableCategories.filter(cat => 
        selectedCategories.includes(cat.categoryId)
      );
      
      if (onCategoriesChange) {
        onCategoriesChange(updatedCategories);
      }
      
      success('Product categories updated successfully');
    } catch (err) {
      showError('Failed to update categories');
      console.error('Error updating categories:', err);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    const currentIds = currentCategories.map(cat => cat.categoryId).sort();
    const selectedIds = [...selectedCategories].sort();
    return JSON.stringify(currentIds) !== JSON.stringify(selectedIds);
  };

  if (loading) {
    return (
      <div className={styles.categoryManager}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.categoryManager}>
      <div className={styles.header}>
        <h3 className={styles.title}>Product Categories</h3>
        <div className={styles.selectedCount}>
          {selectedCategories.length} selected
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
          <button onClick={fetchCategories} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      <div className={styles.categoryList}>
        {availableCategories.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <p>No categories available</p>
          </div>
        ) : (
          availableCategories.map((category) => (
            <div
              key={category.categoryId}
              className={`${styles.categoryItem} ${
                selectedCategories.includes(category.categoryId) ? styles.selected : ''
              }`}
              onClick={() => handleCategoryToggle(category.categoryId)}
            >
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>{category.name}</div>
                {category.description && (
                  <div className={styles.categoryDescription}>
                    {category.description}
                  </div>
                )}
              </div>
              
              <div className={styles.categoryActions}>
                <div className={`${styles.checkbox} ${
                  selectedCategories.includes(category.categoryId) ? styles.checked : ''
                }`}>
                  {selectedCategories.includes(category.categoryId) && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasChanges() && (
        <div className={styles.actionBar}>
          <div className={styles.changeIndicator}>
            <span className={styles.changeIcon}>●</span>
            You have unsaved changes
          </div>
          
          <div className={styles.actionButtons}>
            <button
              onClick={() => setSelectedCategories(currentCategories.map(cat => cat.categoryId))}
              className={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSaveCategories}
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManager;