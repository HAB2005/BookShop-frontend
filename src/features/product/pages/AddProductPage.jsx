import { useNavigate } from 'react-router-dom';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import { useProductForm } from '../hooks/useProductForm.js';
import ProductFormWizard from '../components/ProductFormWizard.jsx';
import ProductFormSteps from '../components/ProductFormSteps.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import styles from './AddProductPage.module.css';

function AddProductPage() {
  const navigate = useNavigate();
  const productForm = useProductForm();

  // Set page layout
  usePageLayout({
    title: "Add New Product",
    breadcrumbs: ['Dashboard', 'Products', 'Add Product']
  });

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      productForm.resetForm();
      navigate('/products');
    }
  };

  const handleSubmit = async () => {
    const result = await productForm.submitForm();
    if (result.success) {
      navigate('/products', { 
        state: { 
          message: 'Product created successfully!',
          productId: result.data.productId 
        }
      });
    }
  };

  if (productForm.loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Creating product...</p>
      </div>
    );
  }

  return (
    <div className={styles.addProductPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Add New Product</h1>
          <p className={styles.pageDescription}>
            Create a new product by filling out the information below. 
            You can add basic details, categorize the product, and upload images.
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={productForm.loading}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${productForm.progress}%` }}
          />
        </div>
        <div className={styles.progressText}>
          Step {productForm.currentStep + 1} of {productForm.totalSteps}
        </div>
      </div>

      {/* Form Content */}
      <div className={styles.formContainer}>
        <div className={styles.formLayout}>
          {/* Wizard Navigation */}
          <div className={styles.wizardSidebar}>
            <ProductFormWizard
              currentStep={productForm.currentStep}
              onStepClick={productForm.goToStep}
              formData={productForm.formData}
              errors={productForm.errors}
            />
          </div>

          {/* Form Steps */}
          <div className={styles.formContent}>
            <ProductFormSteps
              currentStep={productForm.currentStep}
              formData={productForm.formData}
              errors={productForm.errors}
              categories={productForm.categories}
              loadingCategories={productForm.loadingCategories}
              onUpdateFormData={productForm.updateFormData}
              onUpdateBookData={productForm.updateBookData}
              onToggleCategory={productForm.toggleCategory}
              onAddImage={productForm.addImage}
              onRemoveImage={productForm.removeImage}
              onSetPrimaryImage={productForm.setPrimaryImage}
              onReorderImages={productForm.reorderImages}
            />

            {/* Form Actions */}
            <div className={styles.formActions}>
              <div className={styles.actionButtons}>
                {!productForm.isFirstStep && (
                  <Button
                    variant="outline"
                    onClick={productForm.prevStep}
                    disabled={productForm.loading}
                  >
                    Previous
                  </Button>
                )}

                <div className={styles.rightActions}>
                  {!productForm.isLastStep ? (
                    <Button
                      variant="primary"
                      onClick={productForm.nextStep}
                      disabled={!productForm.canProceed || productForm.loading}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!productForm.canProceed || productForm.loading}
                      loading={productForm.loading}
                    >
                      Create Product
                    </Button>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {productForm.errors.submit && (
                <div className={styles.submitError}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span className={styles.errorMessage}>
                    {productForm.errors.submit}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className={styles.helpSection}>
        <div className={styles.helpCard}>
          <h3>Need Help?</h3>
          <ul>
            <li>Product name should be descriptive and unique</li>
            <li>Price must be a positive number</li>
            <li>Select relevant categories to help customers find your product</li>
            <li>Upload high-quality images (max 5MB each)</li>
            <li>For books, provide ISBN and publication details when available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;