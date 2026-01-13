import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import CategoryTree from '../components/CategoryTree.jsx';
import CategoryForm from '../components/CategoryForm.jsx';
import { useCategories } from '../hooks/useCategories.js';
import styles from './CategoryManagementPage.module.css';

function CategoryManagementPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    refreshCategories
  } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'

  useEffect(() => {
    fetchCategories({ includeInactive: true, size: 100 });
  }, []);

  const handleAddCategory = (parentCategory = null) => {
    setSelectedParent(parentCategory);
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setSelectedParent(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setSelectedParent(null);
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
      }
      handleCloseForm();
      refreshCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const newStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updateCategoryStatus(category.categoryId, { status: newStatus });
      toast.success(`Category ${newStatus.toLowerCase()} successfully!`);
      refreshCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to update category status');
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  if (loading && !categories.length) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Error Loading Categories</h3>
        <p>{error}</p>
        <button onClick={() => fetchCategories({ includeInactive: true, size: 100 })}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.categoryManagement}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1>📁 Category Management</h1>
            <p>Create and manage product categories</p>
          </div>
          <button
            className={styles.addButton}
            onClick={() => handleAddCategory()}
          >
            ➕ Add Category
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainCard}>
          {/* Card Header with View Toggle */}
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <h2>📋 Categories</h2>
              <p>Manage your product categories</p>
            </div>

            <div className={styles.cardControls}>
              {/* View Mode Toggle */}
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.toggleButton} ${viewMode === 'tree' ? styles.active : ''}`}
                  onClick={() => handleViewModeChange('tree')}
                >
                  <span>🌳 Tree View</span>
                </button>
                <button
                  className={`${styles.toggleButton} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => handleViewModeChange('list')}
                >
                  <span>📋 List View</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                className={styles.refreshButton}
                onClick={refreshCategories}
                disabled={loading}
                title="Refresh Categories"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className={styles.cardContent}>
            {categories.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📂</div>
                <h3>No Categories Found</h3>
                <p>Start by creating your first category to organize your products</p>
                <button
                  className={styles.createFirstButton}
                  onClick={() => handleAddCategory()}
                >
                  ➕ Create First Category
                </button>
              </div>
            ) : (
              <CategoryTree
                categories={categories}
                onAddChild={handleAddCategory}
                onEdit={handleEditCategory}
                onToggleStatus={handleToggleStatus}
                viewMode={viewMode}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          parentCategory={selectedParent}
          categories={categories}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default CategoryManagementPage;