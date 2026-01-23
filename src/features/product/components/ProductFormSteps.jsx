import ProductInfoStep from './steps/ProductInfoStep.jsx';
import ImagesStep from './steps/ImagesStep.jsx';
import ReviewStep from './steps/ReviewStep.jsx';

const FORM_STEPS = {
  PRODUCT_INFO: 0,
  IMAGES: 1,
  REVIEW: 2
};

function ProductFormSteps({
  currentStep,
  formData,
  errors,
  categories,
  loadingCategories,
  onUpdateFormData,
  onUpdateBookData,
  onToggleCategory,
  onAddImage,
  onRemoveImage,
  onSetPrimaryImage,
  onReorderImages
}) {

  const renderCurrentStep = () => {
    switch (currentStep) {
      case FORM_STEPS.PRODUCT_INFO:
        return (
          <ProductInfoStep
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            onUpdateFormData={onUpdateFormData}
            onUpdateBookData={onUpdateBookData}
            onToggleCategory={onToggleCategory}
          />
        );

      case FORM_STEPS.IMAGES:
        return (
          <ImagesStep
            formData={formData}
            errors={errors}
            onAddImage={onAddImage}
            onRemoveImage={onRemoveImage}
            onSetPrimaryImage={onSetPrimaryImage}
            onReorderImages={onReorderImages}
          />
        );

      case FORM_STEPS.REVIEW:
        return (
          <ReviewStep
            formData={formData}
            categories={categories}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-steps">
      {renderCurrentStep()}
    </div>
  );
}

export default ProductFormSteps;