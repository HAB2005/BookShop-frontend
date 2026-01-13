import { useState } from 'react';
import Modal from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/button.jsx';
import { useCurrentUser } from '../hooks/useCurrentUser';
import styles from './ChangePasswordModal.module.css';

function ChangePasswordModal({ isOpen, onClose, onPasswordChanged }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const { changePassword } = useCurrentUser();

  const validateForm = () => {
    const errors = {};
    
    // Current password validation
    if (!formData.currentPassword || formData.currentPassword.trim() === '') {
      errors.currentPassword = 'Current password is required';
    }
    
    // New password validation
    if (!formData.newPassword || formData.newPassword.trim() === '') {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    } else if (formData.newPassword.length > 100) {
      errors.newPassword = 'New password must not exceed 100 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
      errors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when user starts typing
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      await changePassword(formData);
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Auto close after 2 seconds
      setTimeout(() => {
        if (onPasswordChanged) {
          onPasswordChanged();
        }
        handleClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setFormErrors({});
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="medium"
    >
      <div className={styles.changePasswordModal}>
        <form onSubmit={handleSubmit} className={styles.passwordForm}>
          {/* Security Notice */}
          <div className={styles.securityNotice}>
            <span className={styles.securityIcon}>🔒</span>
            <div className={styles.noticeContent}>
              <h4>Security Notice</h4>
              <p>Choose a strong password with at least 6 characters. Avoid using common words or personal information.</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className={styles.successMessage}>
              <span className={styles.successIcon}>✅</span>
              Password changed successfully! This modal will close automatically.
            </div>
          )}

          {/* Form Fields */}
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Current Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.currentPassword ? styles.inputError : ''}`}
                placeholder="Enter current password"
                disabled={saving || success}
              />
              {formErrors.currentPassword && (
                <span className={styles.errorMessage}>{formErrors.currentPassword}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                New Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.newPassword ? styles.inputError : ''}`}
                placeholder="Enter new password"
                disabled={saving || success}
              />
              {formErrors.newPassword && (
                <span className={styles.errorMessage}>{formErrors.newPassword}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Confirm New Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.confirmPassword ? styles.inputError : ''}`}
                placeholder="Confirm new password"
                disabled={saving || success}
              />
              {formErrors.confirmPassword && (
                <span className={styles.errorMessage}>{formErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Form Error */}
          {error && (
            <div className={styles.formError}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={saving || success}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving || success}
            >
              {saving ? 'Changing Password...' : success ? 'Password Changed!' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ChangePasswordModal;