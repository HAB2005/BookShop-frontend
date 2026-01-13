import { memo } from 'react';
import { ActionButton } from '../../../shared/ui/ActionButton.jsx';
import styles from './ProfileHeader.module.css';

function ProfileHeader({ user, onEditProfile, onChangePassword }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <div className={styles.profileHeader}>
      <div className={styles.headerContent}>
        {/* User Avatar & Basic Info */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            <span>{user.fullName?.charAt(0)?.toUpperCase() || user.username?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user.fullName || user.username || 'No name provided'}</h1>
            <div className={styles.badges}>
              <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                {user.role === 'admin' ? '👑' : '👤'} {user.role}
              </span>
              {user.status && (
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(user.status)}`}>
                  <span className={styles.statusDot}></span>
                  {user.status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.headerActions}>
          <ActionButton
            action="edit"
            text="Edit Profile"
            onClick={onEditProfile}
            className={styles.editButton}
          />
          <ActionButton
            action="security"
            text="Change Password"
            onClick={onChangePassword}
            className={styles.passwordButton}
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className={styles.additionalInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>📧</span>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user.email || 'No email provided'}</span>
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>📅</span>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>Member Since</span>
            <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileHeader);