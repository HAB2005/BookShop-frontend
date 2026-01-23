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
      {/* Compact Header */}
      <div className={styles.pageHeader}>
        <h1>Add Product</h1>
        <div className={styles.headerActions}>
          <span className={styles.stepIndicator}>
            {productForm.currentStep + 1}/{productForm.totalSteps}
          </span>
          <Button variant="outline" onClick={handleCancel} disabled={productForm.loading}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Compact Wizard */}
        <div className={styles.wizardNav}>
          <ProductFormWizard
            currentStep={productForm.currentStep}
            onStepClick={productForm.goToStep}
            formData={productForm.formData}
            errors={productForm.errors}
          />
        </div>

        {/* Form Content */}
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
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={styles.bottomActions}>
        {productForm.errors.submit && (
          <div className={styles.errorAlert}>
            ⚠️ {productForm.errors.submit}
          </div>
        )}
        
        <div className={styles.actionButtons}>
          {!productForm.isFirstStep && (
            <Button variant="outline" onClick={productForm.prevStep} disabled={productForm.loading}>
              ← Back
            </Button>
          )}
          
          <div className={styles.spacer} />
          
          {!productForm.isLastStep ? (
            <Button 
              variant="primary" 
              onClick={productForm.nextStep} 
              disabled={!productForm.canProceed || productForm.loading}
            >
              Next →
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
    </div>
  );
}

export default AddProductPage;