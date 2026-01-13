import { useState, useEffect } from 'react';
import styles from './CategoryForm.module.css';

function CategoryForm({ 
  category = null, 
  parentCategory = null, 
  categories = [], 
  onSubmit, 
  onClose 
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      // Editing existing category
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        parentId: category.parentId || null
      });
    } else if (parentCategory) {
      // Adding child to specific parent
      setFormData({
        name: '',
        slug: '',
        parentId: parentCategory.categoryId
      });
    } else {
      // Adding root category
      setFormData({
        name: '',
        slug: '',
        parentId: null
      });
    }
  }, [category, parentCategory]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
    
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleSlugChange = (e) => {
    const slug = generateSlug(e.target.value);
    setFormData(prev => ({ ...prev, slug }));
    
    // Clear slug error when user starts typing
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  const handleParentChange = (e) => {
    const parentId = e.target.value ? parseInt(e.target.value) : null;
    setFormData(prev => ({ ...prev, parentId }));
    
    // Clear parent error when user changes selection
    if (errors.parentId) {
      setErrors(prev => ({ ...prev, parentId: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Category name must not exceed 100 characters';
    }

    // Validate slug
    if (!formData.slug.trim()) {
      newErrors.slug = 'Category slug is required';
    } else if (formData.slug.length > 100) {
      newErrors.slug = 'Category slug must not exceed 100 characters';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    // Check for duplicate slug (excluding current category if editing)
    const existingCategory = categories.find(cat => 
      cat.slug === formData.slug && 
      (!isEditing || cat.categoryId !== category.categoryId)
    );
    if (existingCategory) {
      newErrors.slug = 'This slug is already in use';
    }

    // Validate parent (prevent circular reference)
    if (formData.parentId && isEditing) {
      const wouldCreateCircle = checkCircularReference(formData.parentId, category.categoryId);
      if (wouldCreateCircle) {
        newErrors.parentId = 'Cannot set this category as parent (would create circular reference)';
      }
    }

    // Cannot set self as parent
    if (formData.parentId === category?.categoryId) {
      newErrors.parentId = 'Category cannot be its own parent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkCircularReference = (potentialParentId, currentCategoryId) => {
    if (!potentialParentId || !currentCategoryId) return false;
    
    // Check if potentialParent is a descendant of currentCategory
    const isDescendant = (parentId, targetId) => {
      const parent = categories.find(cat => cat.categoryId === parentId);
      if (!parent) return false;
      if (parent.categoryId === targetId) return true;
      if (parent.parentId) return isDescendant(parent.parentId, targetId);
      return false;
    };

    return isDescendant(potentialParentId, currentCategoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Get available parent categories (exclude current category and its descendants if editing)
  const getAvailableParents = () => {
    if (!isEditing) {
      return categories.filter(cat => cat.status === 'ACTIVE');
    }

    // When editing, exclude self and descendants
    const excludeIds = new Set([category.categoryId]);
    
    // Add all descendants to exclude list
    const addDescendants = (parentId) => {
      categories.forEach(cat => {
        if (cat.parentId === parentId) {
          excludeIds.add(cat.categoryId);
          addDescendants(cat.categoryId);
        }
      });
    };
    addDescendants(category.categoryId);

    return categories.filter(cat => 
      cat.status === 'ACTIVE' && !excludeIds.has(cat.categoryId)
    );
  };

  const availableParents = getAvailableParents();

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {isEditing ? '✏️ Edit Category' : '➕ Add Category'}
          </h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formBody}>
            {/* Parent Category Info */}
            {parentCategory && !isEditing && (
              <div className={styles.parentInfo}>
                <h4>Adding child category to:</h4>
                <div className={styles.parentCard}>
                  <span className={styles.parentName}>{parentCategory.name}</span>
                  <span className={styles.parentSlug}>/{parentCategory.slug}</span>
                </div>
              </div>
            )}

            {/* Category Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                placeholder="Enter category name"
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.name && (
                <span className={styles.errorMessage}>{errors.name}</span>
              )}
            </div>

            {/* Category Slug */}
            <div className={styles.formGroup}>
              <label htmlFor="slug" className={styles.label}>
                Category Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`${styles.input} ${errors.slug ? styles.error : ''}`}
                placeholder="category-slug"
                disabled={isSubmitting}
                maxLength={100}
              />
              <div className={styles.slugPreview}>
                URL: /categories/{formData.slug || 'category-slug'}
              </div>
              {errors.slug && (
                <span className={styles.errorMessage}>{errors.slug}</span>
              )}
            </div>

            {/* Parent Category */}
            <div className={styles.formGroup}>
              <label htmlFor="parentId" className={styles.label}>
                Parent Category
              </label>
              <select
                id="parentId"
                value={formData.parentId || ''}
                onChange={handleParentChange}
                className={`${styles.select} ${errors.parentId ? styles.error : ''}`}
                disabled={isSubmitting || (parentCategory && !isEditing)}
              >
                <option value="">-- Root Category --</option>
                {availableParents.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.name} (/{cat.slug})
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <span className={styles.errorMessage}>{errors.parentId}</span>
              )}
              <div className={styles.fieldHelp}>
                Leave empty to create a root category
              </div>
            </div>

            {/* Form Info */}
            {/* <div className={styles.formInfo}>
              <h4>💡 Category Guidelines</h4>
              <ul>
                <li>Category names should be descriptive and unique</li>
                <li>Slugs are used in URLs and must be unique</li>
                <li>Root categories have no parent</li>
                <li>Child categories inherit from their parent</li>
                <li>Avoid creating too many nested levels</li>
              </ul>
            </div> */}
          </div>

          <div className={styles.formFooter}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}>⏳</span>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditing ? '💾 Update Category' : '➕ Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;