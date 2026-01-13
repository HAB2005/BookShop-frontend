import { useState } from 'react';
import styles from './CategoryTreeNode.module.css';

function CategoryTreeNode({
  category,
  level = 0,
  isExpanded = false,
  onToggleExpand,
  onAddChild,
  onEdit,
  onToggleStatus,
  viewMode = 'tree',
  showChildren = true
}) {
  const [showActions, setShowActions] = useState(false);

  const hasChildren = category.children && category.children.length > 0;
  const isActive = category.status === 'ACTIVE';

  const handleToggleExpand = () => {
    if (hasChildren && viewMode === 'tree') {
      onToggleExpand(category.categoryId);
    }
  };

  const handleAddChild = (e) => {
    e.stopPropagation();
    onAddChild(category);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(category);
  };

  const handleToggleStatus = (e) => {
    e.stopPropagation();
    onToggleStatus(category);
  };

  const getIndentStyle = () => {
    return {
      paddingLeft: `${level * 24}px`
    };
  };

  const getExpandIcon = () => {
    if (viewMode === 'list') return '📄'; // Always file icon in list mode
    if (!hasChildren) return '📄';
    return isExpanded ? '📂' : '📁';
  };

  const formatCreatedAt = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.treeNode}>
      {/* Main Node */}
      <div 
        className={`${styles.nodeContent} ${!isActive ? styles.inactive : ''}`}
        style={getIndentStyle()}
        onClick={handleToggleExpand}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Expand/Collapse Button */}
        <button 
          className={`${styles.expandButton} ${(!hasChildren || viewMode === 'list') ? styles.disabled : ''}`}
          onClick={handleToggleExpand}
          disabled={!hasChildren || viewMode === 'list'}
        >
          {getExpandIcon()}
        </button>

        {/* Category Info */}
        <div className={styles.categoryInfo}>
          <div className={styles.categoryMain}>
            <span className={styles.categoryName}>{category.name}</span>
            <span className={styles.categorySlug}>/{category.slug}</span>
            <span className={`${styles.statusBadge} ${styles[category.status.toLowerCase()]}`}>
              {category.status}
            </span>
          </div>
          
          <div className={styles.categoryMeta}>
            <span className={styles.categoryId}>ID: {category.categoryId}</span>
            {category.parentId && (
              <span className={styles.parentId}>Parent: {category.parentId}</span>
            )}
            <span className={styles.createdAt}>
              Created: {formatCreatedAt(category.createdAt)}
            </span>
            {hasChildren && (
              <span className={styles.childrenCount}>
                {category.children.length} child{category.children.length !== 1 ? 'ren' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`${styles.nodeActions} ${showActions ? styles.visible : ''}`}>
          <button 
            className={styles.actionButton}
            onClick={handleAddChild}
            title="Add Child Category"
          >
            ➕
          </button>
          <button 
            className={styles.actionButton}
            onClick={handleEdit}
            title="Edit Category"
          >
            ✏️
          </button>
          <button 
            className={`${styles.actionButton} ${styles.statusButton}`}
            onClick={handleToggleStatus}
            title={isActive ? 'Deactivate Category' : 'Activate Category'}
          >
            {isActive ? '🔴' : '🟢'}
          </button>
        </div>
      </div>

      {/* Children Nodes */}
      {hasChildren && isExpanded && viewMode === 'tree' && showChildren && (
        <div className={styles.childrenContainer}>
          {category.children.map(child => (
            <CategoryTreeNode
              key={child.categoryId}
              category={child}
              level={level + 1}
              isExpanded={false} // Children start collapsed
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              viewMode={viewMode}
              showChildren={showChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryTreeNode;