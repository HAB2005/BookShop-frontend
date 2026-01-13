import { memo } from 'react';
import { ActionButton } from '../../../shared/ui/ActionButton.jsx';
import styles from './ProfileInfo.module.css';

function ProfileInfo({ user, onEditProfile, onChangePassword }) {
  if (!user) return null;

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

  return (
    <div className={styles.profileInfo}>
      <div className={styles.infoHeader}>
        <h2 className={styles.sectionTitle}>Profile Information</h2>
        {/* Removed duplicate Edit button */}
      </div>

      <div className={styles.infoGrid}>
        {/* Personal Information */}
        <div className={styles.infoSection}>
          <h3 className={styles.subsectionTitle}>Personal Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📝</span>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>
                  {user.fullName || (
                    <span className={styles.emptyValue}>Not provided</span>
                  )}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📧</span>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Email Address</span>
                <span className={styles.infoValue}>
                  {user.email || (
                    <span className={styles.emptyValue}>Not provided</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className={styles.infoSection}>
          <h3 className={styles.subsectionTitle}>Account Information</h3>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🔐</span>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>
                  <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleCustomer}`}>
                    {user.role === 'admin' ? '👑' : '👤'} {user.role}
                  </span>
                </span>
              </div>
            </div>

            {user.status && (
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📊</span>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Account Status</span>
                  <span className={styles.infoValue}>
                    <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive :
                      user.status === 'inactive' ? styles.statusInactive :
                        styles.statusBanned}`}>
                      <span className={styles.statusDot}></span>
                      {user.status}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📅</span>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>Account Created</span>
                <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileInfo);