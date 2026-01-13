import { useCallback, useMemo, useState } from 'react';
import UserList from "../components/UserList.jsx";
import AddUserModal from "../components/AddUserModal.jsx";
import { Button } from "../../../shared/ui/button.jsx";
import { useUsers } from "../hooks/useUsers.js";
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import HeaderSection from '../components/HeaderSection.jsx';
import StatsSection from '../components/StatsSection.jsx';
import FilterSection from '../components/FilterSection.jsx';
import styles from './UserPage.module.css';

function UserPage() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Set page layout
  usePageLayout({
    title: "User Management",
    breadcrumbs: ['Dashboard', 'Administration', 'User Management']
  });

  const {
    users,
    loading,
    error,
    pagination,
    filters,
    loadUsers,
    updateFilters,
    changePage,
    updateUserInList
  } = useUsers();

  // Memoized handlers to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handlePageChange = useCallback((newPage) => {
    changePage(newPage);
  }, [changePage]);

  const handleAddUser = useCallback(() => {
    setIsAddUserModalOpen(true);
  }, []);

  const handleCloseAddUserModal = useCallback(() => {
    setIsAddUserModalOpen(false);
  }, []);

  const handleUserCreated = useCallback(() => {
    // Refresh the user list to show the new user
    loadUsers();
    setIsAddUserModalOpen(false);
  }, [loadUsers]);

  const handleExportUsers = useCallback(() => {
    console.log('Export users');
  }, []);

  // Memoized pagination component to prevent re-renders
  const PaginationSection = useMemo(() => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className={styles.pagination}>
        <Button
          label="Previous"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.first}
          variant="outline"
        />
        <span className={styles.pageInfo}>
          Page {pagination.page + 1} of {pagination.totalPages}
        </span>
        <Button
          label="Next"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.last}
          variant="outline"
        />
      </div>
    );
  }, [pagination, handlePageChange]);

  return (
    <div className={styles.userPage}>
      {/* Header Section - Memoized */}
      <HeaderSection
        onAddUser={handleAddUser}
        onExportUsers={handleExportUsers}
      />

      {/* Stats Cards - Memoized */}
      <StatsSection
        users={users}
        pagination={pagination}
      />

      {/* Filters Section - Isolated state */}
      <FilterSection
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* Content Section */}
      <div className={styles.contentSection}>
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading users...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Error Loading Users</h3>
            <p>{error}</p>
            <Button
              label="Retry"
              onClick={() => loadUsers()}
              variant="outline"
            />
          </div>
        )}

        {!loading && !error && (
          <>
            <div className={styles.resultsHeader}>
              <p className={styles.resultsCount}>
                Showing {users.length} of {pagination.totalElements} users
                {pagination.totalPages > 1 && (
                  <span> (Page {pagination.page + 1} of {pagination.totalPages})</span>
                )}
              </p>
            </div>
            <UserList
              users={users}
              onUserUpdated={updateUserInList}
            />

            {/* Pagination - Memoized */}
            {PaginationSection}
          </>
        )}
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}

export default UserPage;