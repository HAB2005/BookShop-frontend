import { useState } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { IconButton } from '../../../shared/ui/IconButton.jsx';
import UserDetailModal from './UserDetailModal';
import EditUserModal from './EditUserModal';
import styles from './UserList.module.css';

function UserList({ users = [], onUserUpdated }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [errorAction, setErrorAction] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { updateUserStatus } = useAdminUsers();

  if (!users || users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>👥</div>
        <h3>No Users Found</h3>
        <p>No users match your current filters. Try adjusting your search criteria.</p>
      </div>
    );
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus?.toLowerCase() === 'active' ? 'inactive' : 'active';

    // Set loading state
    setLoadingAction(`status-${userId}`);
    setErrorAction(null);

    // Optimistic update - Update UI immediately
    if (onUserUpdated) {
      onUserUpdated(userId, { status: newStatus });
    }

    try {
      // Call API to update status
      await updateUserStatus(userId, newStatus);
    } catch (error) {

      // Revert optimistic update on error
      if (onUserUpdated) {
        onUserUpdated(userId, { status: currentStatus });
      }

      // Show error state
      setErrorAction(`status-${userId}`);

      // Auto-clear error after 3 seconds
      setTimeout(() => {
        setErrorAction(null);
      }, 3000);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleViewDetails = (userId) => {
    setSelectedUserId(userId);
    setIsDetailModalOpen(true);
  };

  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUserId(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div className={styles.userListContainer}>
      <div className={styles.cardsGrid}>
        {users.map((user) => (
          <div key={user.userId} className={styles.userCard}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
              {/* User Info Section - Contains all user info */}
              <div className={styles.userInfoSection}>
                {/* Basic Info: Avatar + Name + ID */}
                <div className={styles.userBasicInfo}>
                  <div className={styles.userAvatar}>
                    <span>{user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || '?'}</span>
                  </div>
                  <div className={styles.userDetails}>
                    <h3 className={styles.username}>{user.fullName || user.username || 'N/A'}</h3>
                    <p className={styles.userId}>ID: {user.userId}</p>
                  </div>
                </div>

                {/* Contact Info: Email */}
                <div className={styles.userContactInfo}>
                  <span className={styles.contactIcon}>📧</span>
                  <span className={styles.contactText}>{user.email || 'No email'}</span>
                </div>
              </div>

              {/* Actions Section */}
              <div className={styles.cardActions}>
                <IconButton
                  icon={
                    loadingAction === `status-${user.userId}` ? (
                      <span className={styles.spinner}></span>
                    ) : errorAction === `status-${user.userId}` ? (
                      '⚠️'
                    ) : user.status?.toLowerCase() === 'active' ? (
                      '🔒'
                    ) : (
                      '🔓'
                    )
                  }
                  onClick={() => handleToggleStatus(user.userId, user.status)}
                  disabled={loadingAction === `status-${user.userId}`}
                  title={
                    errorAction === `status-${user.userId}`
                      ? 'Failed to update status - Click to retry'
                      : user.status?.toLowerCase() === 'active'
                        ? 'Deactivate user'
                        : 'Activate user'
                  }
                  variant={errorAction === `status-${user.userId}` ? 'danger' : 'ghost'}
                  className={`${styles.actionButton} ${styles.toggleButton} ${user.status?.toLowerCase() === 'active' ? styles.deactivateButton : styles.activateButton
                    } ${errorAction === `status-${user.userId}` ? styles.errorButton : ''}`}
                />
                <IconButton
                  icon="✏️"
                  onClick={() => handleEditUser(user.userId)}
                  title="Edit user profile"
                  variant="ghost"
                  className={`${styles.actionButton} ${styles.editButton}`}
                />
                <IconButton
                  icon="👁️"
                  onClick={() => handleViewDetails(user.userId)}
                  title="View user details"
                  variant="ghost"
                  className={`${styles.actionButton} ${styles.detailsButton}`}
                />
              </div>
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
              <div className={styles.metaInfo}>
                <div className={styles.badges}>
                  <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                    {user.role === 'admin' ? '👑' : '👤'} {user.role || 'No role'}
                  </span>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(user.status)}`}>
                    <span className={styles.statusDot}></span>
                    {user.status || 'Unknown'}
                  </span>
                </div>

                <div className={styles.dateInfo}>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Created:</span>
                    <span className={styles.dateValue}>{formatDate(user.createdAt)}</span>
                  </div>
                  {user.lastLogin && (
                    <div className={styles.dateItem}>
                      <span className={styles.dateLabel}>Last Login:</span>
                      <span className={styles.dateValue}>{formatDate(user.lastLogin)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        userId={selectedUserId}
        onUserUpdated={onUserUpdated}
        onEditUser={handleEditUser}
      />

      {/* User Edit Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        userId={selectedUserId}
        onUserUpdated={onUserUpdated}
      />
    </div>
  );
}

export default UserList;
