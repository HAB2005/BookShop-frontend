import { useState, useEffect } from 'react';
import Modal from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { getUserDetailAdminService, updateUserProfileAdminService } from '../services/userService';
import styles from './EditUserModal.module.css';

function EditUserModal({ isOpen, onClose, userId, onUserUpdated }) {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    fullName: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Load user detail when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetail();
    }
  }, [isOpen, userId]);

  const loadUserDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const user = await getUserDetailAdminService(userId);
      setUserDetail(user);
      setFormData({
        email: user.email || '',
        fullName: user.fullName || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    setError('');
    
    try {
      const updatedUser = await updateUserProfileAdminService(userId, formData);
      
      // Update user in parent component
      if (onUserUpdated) {
        onUserUpdated(userId, updatedUser);
      }
      
      // Close modal
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({ email: '', fullName: '' });
      setFormErrors({});
      setError('');
      setUserDetail(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit User Profile"
      size="medium"
    >
      <div className={styles.editUserModal}>
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading user details...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Error Loading User</h3>
            <p>{error}</p>
            <Button 
              label="Retry" 
              onClick={loadUserDetail}
              variant="outline"
            />
          </div>
        )}

        {userDetail && !loading && (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            {/* User Info Header */}
            <div className={styles.userHeader}>
              <div className={styles.userAvatar}>
                <span>{userDetail.username?.charAt(0)?.toUpperCase() || '?'}</span>
              </div>
              <div className={styles.userInfo}>
                <h3>{userDetail.username}</h3>
                <p className={styles.userRole}>
                  {userDetail.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
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

export default EditUserModal;