import { useState, useEffect } from 'react';
import Modal from '../../../shared/ui/Modal.jsx';
import ConfirmationModal from '../../../shared/ui/ConfirmationModal.jsx';
import { ActionButton } from '../../../shared/ui/ActionButton.jsx';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useToastContext } from '../../../app/providers';
import styles from './UserDetailModal.module.css';

function UserDetailModal({ isOpen, onClose, userId, onUserUpdated, onEditUser }) {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toast = useToastContext();

  const handleEditProfile = () => {
    if (onEditUser && userId) {
      onClose(); // Close detail modal first
      onEditUser(userId); // Open edit modal
    }
  };

  const { getUserDetail, resetUserPassword } = useAdminUsers();

  // Load user detail when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetail();
    }
  }, [isOpen, userId]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUserDetail(null);
      setError('');
      setShowConfirmModal(false);
    }
  }, [isOpen]);

  const loadUserDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const detail = await getUserDetail(userId);
      setUserDetail(detail);
    } catch (err) {
      setError(err.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!userDetail) return;

    setResetPasswordLoading(true);

    try {
      await resetUserPassword(userId);
      
      toast.success(`Password reset to "123456" for ${userDetail.fullName || userDetail.username}`);
      setShowConfirmModal(false);

    } catch (err) {
      toast.error(`Failed to reset password: ${err.message}`);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return styles.roleAdmin;
      case 'customer':
        return styles.roleCustomer;
      default:
        return styles.roleDefault;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'banned':
        return styles.statusBanned;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="extraLarge"
    >
      <div className={styles.modalContent}>
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading user details...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Error Loading User Details</h3>
            <p>{error}</p>
            <Button 
              label="Retry" 
              onClick={loadUserDetail}
              variant="outline"
            />
          </div>
        )}

        {userDetail && !loading && !error && (
          <div className={styles.userDetailContent}>
            {/* Main Content - Horizontal Layout */}
            <div className={styles.mainContent}>
              {/* Left Column - User Info */}
              <div className={styles.leftColumn}>
                <div className={styles.userHeader}>
                  <div className={styles.userAvatar}>
                    <span>{userDetail.username?.charAt(0)?.toUpperCase() || '?'}</span>
                  </div>
                  <div className={styles.userBasicInfo}>
                    <h3 className={styles.username}>{userDetail.username}</h3>
                    <p className={styles.userId}>ID: {userDetail.userId}</p>
                    <div className={styles.badges}>
                      <span className={`${styles.roleBadge} ${getRoleBadgeClass(userDetail.role)}`}>
                        {userDetail.role === 'admin' ? '👑' : '👤'} {userDetail.role}
                      </span>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(userDetail.status)}`}>
                        <span className={styles.statusDot}></span>
                        {userDetail.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Contact Information</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📧</span>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Email</span>
                        <span className={styles.infoValue}>
                          {userDetail.email || 'No email provided'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>👤</span>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Full Name</span>
                        <span className={styles.infoValue}>
                          {userDetail.fullName || 'No full name provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Account Info & Actions */}
              <div className={styles.rightColumn}>
                {/* Account Information */}
                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Account Information</h4>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📅</span>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Created Date</span>
                        <span className={styles.infoValue}>
                          {formatDate(userDetail.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>🔐</span>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Role</span>
                        <span className={styles.infoValue}>
                          {userDetail.role} {userDetail.role === 'admin' ? '(Administrator)' : '(Customer)'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📊</span>
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Status</span>
                        <span className={styles.infoValue}>
                          {userDetail.status} {userDetail.status === 'active' ? '(Can login)' : '(Cannot login)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className={styles.actionsSection}>
                  <h4 className={styles.sectionTitle}>Admin Actions</h4>

                  <div className={styles.actionButtons}>
                    <ActionButton
                      action="edit"
                      text="Edit Profile"
                      onClick={handleEditProfile}
                      variant="secondary"
                      className={styles.editProfileButton}
                    />
                    <button
                      className={`${styles.resetPasswordButton} ${resetPasswordLoading ? styles.loading : ''}`}
                      onClick={handleResetPasswordClick}
                      disabled={resetPasswordLoading}
                    >
                      {resetPasswordLoading ? (
                        <>
                          <span className={styles.buttonSpinner}></span>
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <span className={styles.resetIcon}>🔄</span>
                          Reset to Default (123456)
                        </>
                      )}
                    </button>
                  </div>

                  <div className={styles.actionNote}>
                    <p>
                      <strong>Reset to Default:</strong> Reset password to "123456".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmResetPassword}
        title="Reset Password Confirmation"
        message={`Are you sure you want to reset password for user "${userDetail?.fullName || userDetail?.username}" to default password "123456"?`}
        confirmText="Reset Password"
        cancelText="Cancel"
        type="danger"
      />
    </Modal>
  );
}

export default UserDetailModal;