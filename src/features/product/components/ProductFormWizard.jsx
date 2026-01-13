import { useMemo } from 'react';
import styles from './ProductFormWizard.module.css';

const WIZARD_STEPS = [
  {
    id: 0,
    title: 'Basic Info',
    description: 'Product name and price',
    icon: '📝',
    fields: ['name', 'price', 'status']
  },
  {
    id: 1,
    title: 'Categories',
    description: 'Product categorization',
    icon: '🏷️',
    fields: ['categoryIds']
  },
  {
    id: 2,
    title: 'Product Details',
    description: 'Type and specifications',
    icon: '📚',
    fields: ['productType', 'book']
  },
  {
    id: 3,
    title: 'Images',
    description: 'Product photos',
    icon: '🖼️',
    fields: ['images']
  },
  {
    id: 4,
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
      case 0: // Basic Info
        return data.name.trim() && data.price && parseFloat(data.price) > 0;
      
      case 1: // Categories
        return data.categoryIds && data.categoryIds.length > 0;
      
      case 2: // Product Details
        if (data.productType === 'book') {
          // For books, at least description should be provided
          return data.book && data.book.description && data.book.description.trim();
        }
        return true; // General products don't require additional details
      
      case 3: // Images
        return true; // Images are optional
      
      case 4: // Review
        return false; // Review step is never "completed"
      
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
      <div className={styles.wizardHeader}>
        <h3>Create Product</h3>
        <p>Follow the steps to add your product</p>
      </div>

      <div className={styles.stepsList}>
        {stepStatus.map((step, index) => (
          <div key={step.id} className={styles.stepContainer}>
            {/* Step Item */}
            <div
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
              {/* Step Number/Icon */}
              <div className={styles.stepIndicator}>
                {step.isCompleted ? (
                  <span className={styles.checkIcon}>✓</span>
                ) : step.hasErrors ? (
                  <span className={styles.errorIcon}>!</span>
                ) : (
                  <span className={styles.stepNumber}>{step.id + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                </div>
                <p className={styles.stepDescription}>{step.description}</p>
                
                {/* Step Status */}
                {step.hasErrors && (
                  <div className={styles.stepStatus}>
                    <span className={styles.statusError}>Has errors</span>
                  </div>
                )}
                {step.isCompleted && !step.hasErrors && (
                  <div className={styles.stepStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                  </div>
                )}
                {step.isCurrent && (
                  <div className={styles.stepStatus}>
                    <span className={styles.statusCurrent}>Current</span>
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < stepStatus.length - 1 && (
              <div className={`${styles.stepConnector} ${
                step.isCompleted ? styles.connectorCompleted : ''
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className={styles.progressSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Completed:</span>
          <span className={styles.summaryValue}>
            {stepStatus.filter(s => s.isCompleted).length} / {stepStatus.length - 1}
          </span>
        </div>
        
        {stepStatus.some(s => s.hasErrors) && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Errors:</span>
            <span className={styles.summaryValue}>
              {stepStatus.filter(s => s.hasErrors).length}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <div className={styles.actionHint}>
          <span className={styles.hintIcon}>💡</span>
          <p>Click on any accessible step to jump directly to it</p>
        </div>
      </div>
    </div>
  );
}

export default ProductFormWizard;