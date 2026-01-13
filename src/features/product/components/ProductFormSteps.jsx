import BasicInfoStep from './steps/BasicInfoStep.jsx';
import CategoriesStep from './steps/CategoriesStep.jsx';
import ProductDetailsStep from './steps/ProductDetailsStep.jsx';
import ImagesStep from './steps/ImagesStep.jsx';
import ReviewStep from './steps/ReviewStep.jsx';

const FORM_STEPS = {
  BASIC_INFO: 0,
  CATEGORIES: 1,
  PRODUCT_DETAILS: 2,
  IMAGES: 3,
  REVIEW: 4
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
      case FORM_STEPS.BASIC_INFO:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onUpdateFormData={onUpdateFormData}
          />
        );

      case FORM_STEPS.CATEGORIES:
        return (
          <CategoriesStep
            formData={formData}
            errors={errors}
            categories={categories}
            loadingCategories={loadingCategories}
            onToggleCategory={onToggleCategory}
          />
        );

      case FORM_STEPS.PRODUCT_DETAILS:
        return (
          <ProductDetailsStep
            formData={formData}
            errors={errors}
            onUpdateFormData={onUpdateFormData}
            onUpdateBookData={onUpdateBookData}
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