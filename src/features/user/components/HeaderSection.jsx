import { memo, useCallback } from 'react';
import { ActionButton } from '../../../shared/ui/ActionButton.jsx';
import styles from '../pages/UserPage.module.css';

function HeaderSection({ onAddUser, onExportUsers }) {
  const handleAddUser = useCallback(() => {
    console.log('Add new user');
    if (onAddUser) onAddUser();
  }, [onAddUser]);

  const handleExportUsers = useCallback(() => {
    console.log('Export users');
    if (onExportUsers) onExportUsers();
  }, [onExportUsers]);

  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageDescription}>
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className={styles.headerActions}>
          <ActionButton
            action="export"
            text="Export Users"
            onClick={handleExportUsers}
            className={styles.exportButton}
          />
          <ActionButton
            action="add"
            text="Add New User"
            onClick={handleAddUser}
            className={styles.addButton}
          />
        </div>
      </div>
    </div>
  );
}

// Memo - header rarely changes
export default memo(HeaderSection);