import { useState } from 'react';
import Modal from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useToastContext } from '../../../app/providers';
import styles from './AddUserModal.module.css';

function AddUserModal({ isOpen, onClose, onUserCreated }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'customer',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  const { createUser } = useAdminUsers();
  const toast = useToastContext();

  const validateForm = () => {
    const errors = {};
    
    // Email validation (now required)
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 100) {
      errors.email = 'Email must not exceed 100 characters';
    }
    
    // Password validation
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 100) {
      errors.password = 'Password must not exceed 100 characters';
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
      const newUser = await createUser(formData);
      
      toast.success(`User "${newUser.fullName || newUser.email}" created successfully!`);
      
      // Notify parent component
      if (onUserCreated) {
        onUserCreated(newUser);
      }
      
      // Reset form and close modal
      handleClose();
    } catch (err) {
      toast.error(`Failed to create user: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setFormData({
        email: '',
        password: '',
        fullName: '',
        role: 'customer',
        status: 'active'
      });
      setFormErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      size="large"
    >
      <div className={styles.addUserModal}>
        <form onSubmit={handleSubmit} className={styles.addForm}>
          {/* Form Fields */}
          <div className={styles.formFields}>
            {/* Email - Full Width */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
                placeholder="Enter password"
                disabled={saving}
              />
              {formErrors.password && (
                <span className={styles.errorMessage}>{formErrors.password}</span>
              )}
            </div>

            {/* Full Name */}
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

            {/* Role */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Role <span className={styles.required}>*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={styles.select}
                disabled={saving}
              >
                <option value="customer">👤 Customer</option>
                <option value="admin">👑 Administrator</option>
              </select>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Status <span className={styles.required}>*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={styles.select}
                disabled={saving}
              >
                <option value="active">🟢 Active</option>
                <option value="inactive">🟡 Inactive</option>
              </select>
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
              {saving ? 'Creating User...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddUserModal;