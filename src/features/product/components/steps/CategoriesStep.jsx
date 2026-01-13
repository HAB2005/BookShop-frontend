import { useState, useMemo } from 'react';
import LoadingSpinner from '../../../../shared/ui/LoadingSpinner.jsx';
import styles from './CategoriesStep.module.css';

function CategoriesStep({ 
  formData, 
  errors, 
  categories, 
  loadingCategories, 
  onToggleCategory 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Filter and organize categories
  const filteredCategories = useMemo(() => {
    let filtered = categories || [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selection status
    if (showOnlySelected) {
      filtered = filtered.filter(category =>
        formData.categoryIds.includes(category.categoryId)
      );
    }

    // Organize by parent-child relationship
    const parentCategories = filtered.filter(cat => !cat.parentId);
    const childCategories = filtered.filter(cat => cat.parentId);

    return {
      parents: parentCategories,
      children: childCategories,
      all: filtered
    };
  }, [categories, searchTerm, showOnlySelected, formData.categoryIds]);

  const selectedCount = formData.categoryIds.length;

  const handleCategoryToggle = (categoryId) => {
    onToggleCategory(categoryId);
  };

  const isCategorySelected = (categoryId) => {
    return formData.categoryIds.includes(categoryId);
  };

  const getChildCategories = (parentId) => {
    return filteredCategories.children.filter(cat => cat.parentId === parentId);
  };

  if (loadingCategories) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className={styles.categoriesStep}>
      <div className={styles.stepHeader}>
        <h2>Product Categories</h2>
        <p>Select one or more categories that best describe your product</p>
      </div>

      {/* Search and Filter Controls */}
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
            <span>Show only selected ({selectedCount})</span>
          </label>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className={styles.selectionSummary}>
          <h4>Selected Categories ({selectedCount})</h4>
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
        </div>
      )}

      {/* Categories List */}
      <div className={styles.categoriesContainer}>
        {filteredCategories.all.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>No categories found</h3>
            <p>
              {searchTerm 
                ? `No categories match "${searchTerm}"`
                : 'No categories available'
              }
            </p>
          </div>
        ) : (
          <div className={styles.categoriesList}>
            {/* Parent Categories */}
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
                      {category.slug && (
                        <span className={styles.categorySlug}>/{category.slug}</span>
                      )}
                    </div>
                    <div className={styles.categoryActions}>
                      {isCategorySelected(category.categoryId) && (
                        <span className={styles.selectedIcon}>✓</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Child Categories */}
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
                        {childCategory.slug && (
                          <span className={styles.categorySlug}>/{childCategory.slug}</span>
                        )}
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

            {/* Orphaned Child Categories (no parent in filtered results) */}
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
                      {category.slug && (
                        <span className={styles.categorySlug}>/{category.slug}</span>
                      )}
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

      {/* Tips */}
      <div className={styles.tipsSection}>
        <h4>💡 Category Selection Tips</h4>
        <ul className={styles.tipsList}>
          <li>Select the most specific categories that apply to your product</li>
          <li>Choose 2-4 categories for better discoverability</li>
          <li>Parent categories automatically include their subcategories</li>
          <li>You can search for categories using the search box above</li>
        </ul>
      </div>
    </div>
  );
}

export default CategoriesStep;