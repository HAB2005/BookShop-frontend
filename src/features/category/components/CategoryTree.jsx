import { useState, useMemo } from 'react';
import CategoryTreeNode from './CategoryTreeNode.jsx';
import styles from './CategoryTree.module.css';

function CategoryTree({ 
  categories = [], 
  onAddChild, 
  onEdit, 
  onToggleStatus, 
  viewMode = 'tree',
  loading = false 
}) {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Organize categories based on viewMode
  const organizedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    // Filter by search term first
    let filteredCategories = categories;
    if (searchTerm) {
      filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (viewMode === 'list') {
      // Return flat list sorted by name
      return filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Build tree structure for tree view
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    filteredCategories.forEach(category => {
      categoryMap.set(category.categoryId, {
        ...category,
        children: []
      });
    });

    // Second pass: build parent-child relationships
    filteredCategories.forEach(category => {
      const categoryNode = categoryMap.get(category.categoryId);
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        // Add to parent's children
        const parent = categoryMap.get(category.parentId);
        parent.children.push(categoryNode);
      } else {
        // Root category or parent not in filtered results
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }, [categories, searchTerm, viewMode]);

  const handleToggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleExpandAll = () => {
    if (viewMode === 'list') return; // No expand/collapse in list mode
    
    const allIds = new Set();
    const addAllIds = (cats) => {
      cats.forEach(cat => {
        allIds.add(cat.categoryId);
        if (cat.children && cat.children.length > 0) {
          addAllIds(cat.children);
        }
      });
    };
    addAllIds(organizedCategories);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    if (viewMode === 'list') return; // No expand/collapse in list mode
    setExpandedNodes(new Set());
  };

  const getCategoryStats = () => {
    const stats = {
      total: categories.length,
      active: categories.filter(cat => cat.status === 'ACTIVE').length,
      inactive: categories.filter(cat => cat.status === 'INACTIVE').length,
      root: categories.filter(cat => !cat.parentId).length
    };
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className={styles.categoryTree}>
      {/* Search and Controls */}
      <div className={styles.treeControls}>
        <div className={styles.searchSection}>
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
        </div>

        <div className={styles.controlButtons}>
          {viewMode === 'tree' && (
            <>
              <button 
                className={styles.controlButton}
                onClick={handleExpandAll}
                title="Expand All"
              >
                📂 Expand All
              </button>
              <button 
                className={styles.controlButton}
                onClick={handleCollapseAll}
                title="Collapse All"
              >
                📁 Collapse All
              </button>
            </>
          )}
          {viewMode === 'list' && (
            <div className={styles.viewModeInfo}>
              📋 List View - All categories shown flat
            </div>
          )}
        </div>
      </div>

      {/* Category Stats */}
      <div className={styles.categoryStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total:</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Active:</span>
          <span className={`${styles.statValue} ${styles.active}`}>{stats.active}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Inactive:</span>
          <span className={`${styles.statValue} ${styles.inactive}`}>{stats.inactive}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Root:</span>
          <span className={styles.statValue}>{stats.root}</span>
        </div>
      </div>

      {/* Tree Content */}
      <div className={styles.treeContent}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}>⏳</div>
            <span>Loading categories...</span>
          </div>
        )}

        {organizedCategories.length === 0 && !loading ? (
          <div className={styles.emptyTree}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>No Categories Found</h3>
            <p>
              {searchTerm 
                ? `No categories match "${searchTerm}"`
                : 'No categories available'
              }
            </p>
            {searchTerm && (
              <button 
                className={styles.clearSearchButton}
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={styles.treeNodes}>
            {viewMode === 'list' ? (
              // Flat list view
              organizedCategories.map(category => (
                <CategoryTreeNode
                  key={category.categoryId}
                  category={category}
                  level={0}
                  isExpanded={false}
                  onToggleExpand={() => {}} // No expand in list mode
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  viewMode={viewMode}
                  showChildren={false}
                />
              ))
            ) : (
              // Tree view
              organizedCategories.map(category => (
                <CategoryTreeNode
                  key={category.categoryId}
                  category={category}
                  level={0}
                  isExpanded={expandedNodes.has(category.categoryId)}
                  onToggleExpand={handleToggleExpand}
                  onAddChild={onAddChild}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  viewMode={viewMode}
                  showChildren={true}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Tree Legend */}
      <div className={styles.treeLegend}>
        <h4>Legend:</h4>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendIcon}>📁</span>
            <span>Category with children</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIcon}>📄</span>
            <span>Category without children</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendIcon} ${styles.active}`}>●</span>
            <span>Active category</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendIcon} ${styles.inactive}`}>●</span>
            <span>Inactive category</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryTree;