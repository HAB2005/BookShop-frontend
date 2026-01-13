import { useState, useEffect } from 'react';
import Modal from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useToastContext } from '../../../app/providers';
import styles from './EditProfileModal.module.css';

function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const { updateUserProfile } = useCurrentUser();
  const toast = useToastContext();

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        email: user.email || '',
        fullName: user.fullName || ''
      });
      setFormErrors({});
    }
  }, [isOpen, user]);

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 100) {
      errors.email = 'Email must not exceed 100 characters';
    }
    
    // Full name validation
    if (formData.fullName && formData.fullName.length > 100) {
      errors.fullName = 'Full name must not exceed 100 characters';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const updatedUser = await updateUserProfile(formData);
      
      toast.success('Profile updated successfully!');
      
      // Notify parent component
      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }
      
      // Close modal
      onClose();
    } catch (err) {
      toast.error(`Failed to update profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({ email: '', fullName: '' });
      setFormErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Profile"
      size="medium"
    >
      <div className={styles.editProfileModal}>
        {user && (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            {/* User Info Header */}
            <div className={styles.userHeader}>
              <div className={styles.userAvatar}>
                <span>{user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || '?'}</span>
              </div>
              <div className={styles.userInfo}>
                <h3>{user.fullName || user.username || 'No name provided'}</h3>
                <p className={styles.userRole}>
                  {user.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className={styles.formFields}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Email Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                  placeholder="Enter email address"
                  disabled={saving}
                />
                {formErrors.email && (
                  <span className={styles.errorMessage}>{formErrors.email}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`${styles.input} ${formErrors.fullName ? styles.inputError : ''}`}
                  placeholder="Enter full name (optional)"
                  disabled={saving}
                />
                {formErrors.fullName && (
                  <span className={styles.errorMessage}>{formErrors.fullName}</span>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default EditProfileModal;