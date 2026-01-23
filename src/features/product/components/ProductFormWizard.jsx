import { useMemo } from 'react';
import styles from './ProductFormWizard.module.css';

const WIZARD_STEPS = [
  {
    id: 0,
    title: 'Product Info',
    description: 'Basic details & categories',
    icon: '📝',
    fields: ['name', 'price', 'status', 'categoryIds', 'productType', 'book']
  },
  {
    id: 1,
    title: 'Images',
    description: 'Product photos',
    icon: '🖼️',
    fields: ['images']
  },
  {
    id: 2,
    title: 'Review',
    description: 'Final review',
    icon: '✅',
    fields: []
  }
];

function ProductFormWizard({ currentStep, onStepClick, formData, errors }) {
  
  // Helper function to check step completion
  const getStepCompletionStatus = (stepId, data) => {
    switch (stepId) {
      case 0: // Product Info
        const hasBasicInfo = data.name.trim() && data.price && parseFloat(data.price) > 0;
        const hasCategories = data.categoryIds && data.categoryIds.length > 0;
        const hasBookDetails = data.productType !== 'book' || (data.book && data.book.description && data.book.description.trim());
        return hasBasicInfo && hasCategories && hasBookDetails;
      
      case 1: // Images
        return true;
      
      case 2: // Review
        return false;
      
      default:
        return false;
    }
  };

  // Calculate step completion status
  const stepStatus = useMemo(() => {
    return WIZARD_STEPS.map(step => {
      const hasErrors = step.fields.some(field => errors[field]);
      const isCompleted = getStepCompletionStatus(step.id, formData);
      const isCurrent = step.id === currentStep;
      const isAccessible = step.id <= currentStep || isCompleted;
      
      return {
        ...step,
        hasErrors,
        isCompleted,
        isCurrent,
        isAccessible
      };
    });
  }, [currentStep, formData, errors]);

  const handleStepClick = (stepId) => {
    const step = stepStatus.find(s => s.id === stepId);
    if (step && step.isAccessible && !step.isCurrent) {
      onStepClick(stepId);
    }
  };

  return (
    <div className={styles.wizard}>
      <div className={styles.stepsList}>
        {stepStatus.map((step) => (
          <div
            key={step.id}
            className={`${styles.stepItem} ${
              step.isCurrent ? styles.current : ''
            } ${
              step.isCompleted ? styles.completed : ''
            } ${
              step.hasErrors ? styles.hasErrors : ''
            } ${
              step.isAccessible ? styles.accessible : styles.disabled
            }`}
            onClick={() => handleStepClick(step.id)}
          >
            <div className={styles.stepIndicator}>
              {step.isCompleted ? (
                <span className={styles.checkIcon}>✓</span>
              ) : step.hasErrors ? (
                <span className={styles.errorIcon}>!</span>
              ) : (
                <span className={styles.stepNumber}>{step.id + 1}</span>
              )}
            </div>

            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFormWizard;