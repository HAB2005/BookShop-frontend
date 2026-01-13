import { useState, useCallback } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileInfo from '../components/ProfileInfo';
import ChangePasswordModal from '../components/ChangePasswordModal';
import EditProfileModal from '../components/EditProfileModal';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { usePageLayout } from '../../../shared/hooks/usePageLayout';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Set page layout
  usePageLayout({
    title: "My Profile",
    breadcrumbs: ['Dashboard', 'My Profile']
  });

  const {
    user,
    loading,
    error,
    loadUser,
    updateUserProfile
  } = useCurrentUser();

  const handleEditProfile = useCallback(() => {
    setIsEditProfileModalOpen(true);
  }, []);

  const handleChangePassword = useCallback(() => {
    setIsChangePasswordModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditProfileModalOpen(false);
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setIsChangePasswordModalOpen(false);
  }, []);

  const handleProfileUpdated = useCallback((updatedProfile) => {
    updateUserProfile(updatedProfile);
    setIsEditProfileModalOpen(false);
  }, [updateUserProfile]);

  const handlePasswordChanged = useCallback(() => {
    setIsChangePasswordModalOpen(false);
  }, []);

  return (
    <div className={styles.profilePage}>
      {loading && (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => loadUser()}
          >
            Retry
          </button>
        </div>
      )}

      {user && !loading && !error && (
        <>
          {/* Profile Header */}
          <ProfileHeader
            user={user}
            onEditProfile={handleEditProfile}
            onChangePassword={handleChangePassword}
          />

          {/* Profile Information */}
          <ProfileInfo
            user={user}
            onEditProfile={handleEditProfile}
            onChangePassword={handleChangePassword}
          />
        </>
      )}

      {/* Fallback for no data */}
      {!user && !loading && !error && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>👤</div>
          <h3>No Profile Data</h3>
          <p>Unable to load profile information.</p>
          <button
            className={styles.retryButton}
            onClick={() => loadUser()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleCloseEditModal}
        user={user}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleClosePasswordModal}
        user={user}
      />
    </div>
  );
}

export default ProfilePage;