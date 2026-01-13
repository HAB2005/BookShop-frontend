import { useState } from 'react';
import { assignCategoriesToProductApi } from '../api/products.api.js';
import { useCategories } from '../hooks/useCategories.js';
import styles from './CategorySelector.module.css';

function CategorySelector({ productId, currentCategories = [], onCategoriesUpdated }) {
  const { flatCategories, loading: categoriesLoading } = useCategories();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    currentCategories.map(cat => cat.categoryId)
  );
  const [updating, setUpdating] = useState(false);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSaveCategories = async () => {
    try {
      setUpdating(true);
      await assignCategoriesToProductApi(productId, selectedCategoryIds);

      if (onCategoriesUpdated) {
        const updatedCategories = flatCategories.filter(cat =>
          selectedCategoryIds.includes(cat.categoryId)
        );
        onCategoriesUpdated(updatedCategories);
      }

      alert('Categories updated successfully!');
    } catch (error) {
      console.error('Failed to update categories:', error);
      alert('Failed to update categories. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const hasChanges = () => {
    const currentIds = currentCategories.map(cat => cat.categoryId).sort();
    const selectedIds = [...selectedCategoryIds].sort();
    return JSON.stringify(currentIds) !== JSON.stringify(selectedIds);
  };

  if (categoriesLoading) {
    return <div className={styles.loading}>Loading categories...</div>;
  }

  return (
    <div className={styles.categorySelector}>
      <div className={styles.header}>
        <h4 className={styles.title}>Categories</h4>
        {hasChanges() && (
          <button
            onClick={handleSaveCategories}
            disabled={updating}
            className={styles.saveButton}
          >
            {updating ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>

      <div className={styles.categoryList}>
        {flatCategories && flatCategories.length > 0 ? (
          flatCategories.slice(0, 10).map(category => ( // Limit to 10 for simplicity
            <label key={category.categoryId} className={styles.categoryItem}>
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(category.categoryId)}
                onChange={() => handleCategoryToggle(category.categoryId)}
                className={styles.checkbox}
              />
              <span className={styles.categoryName}>
                {category.name}
              </span>
            </label>
          ))
        ) : (
          <div className={styles.noCategories}>No categories available</div>
        )}
      </div>
    </div>
  );
}

export default CategorySelector;