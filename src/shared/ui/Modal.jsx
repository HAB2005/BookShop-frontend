import { useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true
}) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles[size]}`}>
        {(title || showCloseButton) && (
          <div className={styles.modalHeader}>
            {title && <h2 className={styles.modalTitle}>{title}</h2>}
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;