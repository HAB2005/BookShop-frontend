import styles from './ReviewStep.module.css';

function ReviewStep({ formData, categories }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(price));
  };

  const getSelectedCategories = () => {
    return formData.categoryIds
      .map(id => categories.find(cat => cat.categoryId === id))
      .filter(Boolean);
  };

  const getProductTypeName = () => {
    return formData.productType === 'book' ? 'Book' : 'General Product';
  };

  const selectedCategories = getSelectedCategories();

  return (
    <div className={styles.reviewStep}>
      <div className={styles.stepHeader}>
        <h2>Review Product Information</h2>
        <p>Please review all the information before creating your product</p>
      </div>

      {/* Basic Information */}
      <div className={styles.reviewSection}>
        <h3>Basic Information</h3>
        <div className={styles.reviewCard}>
          <div className={styles.reviewGrid}>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Product Name:</span>
              <span className={styles.reviewValue}>{formData.name}</span>
            </div>
            
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Price:</span>
              <span className={`${styles.reviewValue} ${styles.priceValue}`}>
                {formatPrice(formData.price)}
              </span>
            </div>
            
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Status:</span>
              <span className={`${styles.reviewValue} ${styles.statusBadge} ${styles[formData.status.toLowerCase()]}`}>
                {formData.status}
              </span>
            </div>
            
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Product Type:</span>
              <span className={styles.reviewValue}>{getProductTypeName()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.reviewSection}>
        <h3>Categories ({selectedCategories.length})</h3>
        <div className={styles.reviewCard}>
          {selectedCategories.length > 0 ? (
            <div className={styles.categoriesList}>
              {selectedCategories.map(category => (
                <div key={category.categoryId} className={styles.categoryItem}>
                  <span className={styles.categoryIcon}>
                    {category.parentId ? '📄' : '📁'}
                  </span>
                  <span className={styles.categoryName}>{category.name}</span>
                  {category.slug && (
                    <span className={styles.categorySlug}>/{category.slug}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>No categories selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Book Details */}
      {formData.productType === 'book' && (
        <div className={styles.reviewSection}>
          <h3>Book Details</h3>
          <div className={styles.reviewCard}>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>ISBN:</span>
                <span className={styles.reviewValue}>
                  {formData.book.isbn || 'Not specified'}
                </span>
              </div>
              
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Language:</span>
                <span className={styles.reviewValue}>
                  {formData.book.language || 'Not specified'}
                </span>
              </div>
              
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Publication Year:</span>
                <span className={styles.reviewValue}>
                  {formData.book.publishYear || 'Not specified'}
                </span>
              </div>
              
              <div className={styles.reviewItem}>
                <span className={styles.reviewLabel}>Page Count:</span>
                <span className={styles.reviewValue}>
                  {formData.book.pageCount ? `${formData.book.pageCount} pages` : 'Not specified'}
                </span>
              </div>
            </div>
            
            {formData.book.description && (
              <div className={styles.descriptionSection}>
                <span className={styles.reviewLabel}>Description:</span>
                <div className={styles.descriptionContent}>
                  {formData.book.description}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Images */}
      <div className={styles.reviewSection}>
        <h3>Product Images ({formData.images.length})</h3>
        <div className={styles.reviewCard}>
          {formData.images.length > 0 ? (
            <div className={styles.imagesGrid}>
              {formData.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`${styles.imagePreview} ${image.isPrimary ? styles.primaryImage : ''}`}
                >
                  <img
                    src={image.preview}
                    alt={`Product image ${index + 1}`}
                    className={styles.previewImage}
                  />
                  {image.isPrimary && (
                    <div className={styles.primaryBadge}>Primary</div>
                  )}
                  <div className={styles.imageInfo}>
                    <div className={styles.imageName}>{image.file.name}</div>
                    <div className={styles.imageSize}>
                      {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🖼️</div>
              <span>No images added</span>
              <p>Consider adding images to make your product more appealing</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryStats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{formData.name ? '✅' : '❌'}</div>
            <div className={styles.statLabel}>Product Name</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statValue}>{formData.price ? '✅' : '❌'}</div>
            <div className={styles.statLabel}>Price Set</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statValue}>{selectedCategories.length}</div>
            <div className={styles.statLabel}>Categories</div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statValue}>{formData.images.length}</div>
            <div className={styles.statLabel}>Images</div>
          </div>
          
          {formData.productType === 'book' && (
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {formData.book.description ? '✅' : '❌'}
              </div>
              <div className={styles.statLabel}>Description</div>
            </div>
          )}
        </div>
      </div>

      {/* Final Checklist */}
      <div className={styles.checklistSection}>
        <h4>📋 Pre-Launch Checklist</h4>
        <div className={styles.checklist}>
          <div className={`${styles.checklistItem} ${formData.name ? styles.completed : ''}`}>
            <span className={styles.checkIcon}>
              {formData.name ? '✅' : '⭕'}
            </span>
            <span>Product name is descriptive and accurate</span>
          </div>
          
          <div className={`${styles.checklistItem} ${formData.price ? styles.completed : ''}`}>
            <span className={styles.checkIcon}>
              {formData.price ? '✅' : '⭕'}
            </span>
            <span>Price is competitive and correct</span>
          </div>
          
          <div className={`${styles.checklistItem} ${selectedCategories.length > 0 ? styles.completed : ''}`}>
            <span className={styles.checkIcon}>
              {selectedCategories.length > 0 ? '✅' : '⭕'}
            </span>
            <span>Relevant categories are selected</span>
          </div>
          
          <div className={`${styles.checklistItem} ${formData.images.length > 0 ? styles.completed : styles.optional}`}>
            <span className={styles.checkIcon}>
              {formData.images.length > 0 ? '✅' : '📷'}
            </span>
            <span>Product images uploaded (recommended)</span>
          </div>
          
          {formData.productType === 'book' && (
            <div className={`${styles.checklistItem} ${formData.book.description ? styles.completed : styles.optional}`}>
              <span className={styles.checkIcon}>
                {formData.book.description ? '✅' : '📝'}
              </span>
              <span>Book description provided (recommended)</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Message */}
      <div className={styles.actionMessage}>
        <div className={styles.messageCard}>
          <div className={styles.messageIcon}>🚀</div>
          <div className={styles.messageContent}>
            <h4>Ready to Create Product?</h4>
            <p>
              Once you click "Create Product", your product will be added to the catalog 
              with the status "{formData.status}". You can always edit these details later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewStep;