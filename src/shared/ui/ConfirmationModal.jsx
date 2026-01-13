import Modal from './Modal';
import styles from './ConfirmationModal.module.css';

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning" // warning, danger, info
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIconByType = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '🔄';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return styles.dangerButton;
      case 'warning':
        return styles.warningButton;
      case 'info':
        return styles.infoButton;
      default:
        return styles.defaultButton;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      showCloseButton={false}
    >
      <div className={styles.confirmationContent}>
        <div className={styles.iconContainer}>
          <span className={`${styles.icon} ${styles[type]}`}>
            {getIconByType()}
          </span>
        </div>
        
        <div className={styles.messageContainer}>
          <p className={styles.message}>{message}</p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={`${styles.confirmButton} ${getButtonClass()}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;