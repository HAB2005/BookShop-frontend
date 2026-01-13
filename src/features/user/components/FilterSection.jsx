import { useState, useCallback } from 'react';
import Dropdown from '../../../shared/ui/Dropdown.jsx';
import styles from '../pages/UserPage.module.css';

function FilterSection({ onFiltersChange, initialFilters = {} }) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [filterRole, setFilterRole] = useState(initialFilters.role || '');
  const [filterStatus, setFilterStatus] = useState(initialFilters.status || '');

  // Dropdown options
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'customer', label: 'Customer' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Memoized filter update function
  const updateFilters = useCallback((updates) => {
    const newFilters = {
      username: updates.searchTerm?.includes('@') ? '' : updates.searchTerm || '',
      email: updates.searchTerm?.includes('@') ? updates.searchTerm || '' : '',
      role: updates.role || '',
      status: updates.status || ''
    };
    onFiltersChange(newFilters);
  }, [onFiltersChange]);

  const handleRoleChange = useCallback((newRole) => {
    setFilterRole(newRole);
    updateFilters({
      searchTerm,
      role: newRole,
      status: filterStatus
    });
  }, [searchTerm, filterStatus, updateFilters]);

  const handleStatusChange = useCallback((newStatus) => {
    setFilterStatus(newStatus);
    updateFilters({
      searchTerm,
      role: filterRole,
      status: newStatus
    });
  }, [searchTerm, filterRole, updateFilters]);

  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    
    // Debounce API call for search
    const timeoutId = setTimeout(() => {
      updateFilters({
        searchTerm: newSearchTerm,
        role: filterRole,
        status: filterStatus
      });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [filterRole, filterStatus, updateFilters]);

  return (
    <div className={styles.filtersSection}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search users by name, username or email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Role:</label>
        <Dropdown
          value={filterRole}
          onChange={handleRoleChange}
          options={roleOptions}
          placeholder="All Roles"
          className={styles.filterDropdown}
        />
      </div>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status:</label>
        <Dropdown
          value={filterStatus}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="All Status"
          className={styles.filterDropdown}
        />
      </div>
    </div>
  );
}

export default FilterSection;