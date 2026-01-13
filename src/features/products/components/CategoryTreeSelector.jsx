import { useState, useEffect } from 'react';
import { getCategoriesApi } from '../api/categories.api.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import styles from './CategoryTreeSelector.module.css';

function CategoryTreeSelector({ selectedCategories = [], onSelectionChange, disabled = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategoriesApi();
      const categoryList = response.content || response || [];

      // Build tree structure
      const tree = buildCategoryTree(categoryList);
      setCategories(tree);

      // Auto-expand nodes that have selected children
      const toExpand = new Set();
      categoryList.forEach(cat => {
        if (selectedCategories.includes(cat.categoryId) && cat.parentId) {
          expandParents(cat.parentId, categoryList, toExpand);
        }
      });
      setExpandedNodes(toExpand);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (categoryList) => {
    const categoryMap = {};
    const rootCategories = [];

    // Create a map of all categories
    categoryList.forEach(cat => {
      categoryMap[cat.categoryId] = { ...cat, children: [] };
    });

    // Build the tree structure
    categoryList.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat.categoryId]);
      } else {
        rootCategories.push(categoryMap[cat.categoryId]);
      }
    });

    return rootCategories;
  };

  const expandParents = (parentId, categoryList, toExpand) => {
    const parent = categoryList.find(cat => cat.categoryId === parentId);
    if (parent) {
      toExpand.add(parentId);
      if (parent.parentId) {
        expandParents(parent.parentId, categoryList, toExpand);
      }
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const getAllParentIds = (categoryId, categoryList) => {
    const parentIds = [];
    const category = categoryList.find(cat => cat.categoryId === categoryId);

    if (category && category.parentId) {
      parentIds.push(category.parentId);
      parentIds.push(...getAllParentIds(category.parentId, categoryList));
    }

    return parentIds;
  };

  const getAllChildIds = (categoryId, categoryList) => {
    const childIds = [];
    const children = categoryList.filter(cat => cat.parentId === categoryId);

    children.forEach(child => {
      childIds.push(child.categoryId);
      childIds.push(...getAllChildIds(child.categoryId, categoryList));
    });

    return childIds;
  };

  const handleCategoryToggle = (categoryId) => {
    if (disabled) return;

    // Get flat list of all categories for easier traversal
    const flatCategories = [];
    const flattenCategories = (cats) => {
      cats.forEach(cat => {
        flatCategories.push(cat);
        if (cat.children && cat.children.length > 0) {
          flattenCategories(cat.children);
        }
      });
    };
    flattenCategories(categories);

    const newSelection = [...selectedCategories];
    const index = newSelection.indexOf(categoryId);

    if (index > -1) {
      // Deselecting: remove this category and all its children
      newSelection.splice(index, 1);
      const childIds = getAllChildIds(categoryId, flatCategories);
      childIds.forEach(childId => {
        const childIndex = newSelection.indexOf(childId);
        if (childIndex > -1) {
          newSelection.splice(childIndex, 1);
        }
      });
    } else {
      // Selecting: add this category and all its parents
      newSelection.push(categoryId);
      const parentIds = getAllParentIds(categoryId, flatCategories);
      parentIds.forEach(parentId => {
        if (!newSelection.includes(parentId)) {
          newSelection.push(parentId);
        }
      });
    }

    onSelectionChange(newSelection);
  };

  const renderCategoryNode = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedNodes.has(category.categoryId);
    const isSelected = selectedCategories.includes(category.categoryId);

    return (
      <div key={category.categoryId} className={styles.categoryNode}>
        <div
          className={`${styles.categoryItem} ${isSelected ? styles.selected : ''}`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          {hasChildren && (
            <button
              className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
              onClick={() => toggleExpanded(category.categoryId)}
              type="button"
            >
              ▶
            </button>
          )}

          {!hasChildren && <div className={styles.expandSpacer} />}

          <div
            className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}
            onClick={() => handleCategoryToggle(category.categoryId)}
          >
            {isSelected && <span className={styles.checkmark}>✓</span>}
          </div>

          <div
            className={styles.categoryInfo}
            onClick={() => handleCategoryToggle(category.categoryId)}
          >
            <span className={styles.categoryName}>{category.name}</span>
            {category.description && (
              <span className={styles.categoryDescription}>{category.description}</span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className={styles.children}>
            {category.children.map(child => renderCategoryNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="small" />
        <span>Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>⚠️</span>
        <span>{error}</span>
        <button onClick={fetchCategories} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.categoryTree}>
      {categories.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📂</span>
          <span>No categories available</span>
        </div>
      ) : (
        <div className={styles.treeContainer}>
          {categories.map(category => renderCategoryNode(category))}
        </div>
      )}
    </div>
  );
}

export default CategoryTreeSelector;