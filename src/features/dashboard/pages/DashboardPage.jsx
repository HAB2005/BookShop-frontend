import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth.js';
import { usePageLayout } from '../../../shared/hooks/usePageLayout.js';
import styles from './DashboardPage.module.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  // Set page layout
  usePageLayout({
    title: "Admin Dashboard",
    breadcrumbs: ['Dashboard']
  });

  useEffect(() => {
    // Mock stats data for admin
    setStats({
      orders: 156,
      products: 89,
      users: 234,
      revenue: 45678.90
    });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(`.${styles.moduleCard}`)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const managementModules = [
    {
      id: 'products',
      title: 'Product Management',
      description: 'Add, edit, delete and manage product information',
      icon: '📦',
      color: 'blue',
      mainAction: { label: 'Manage Products', path: '/products/manage' },
      dropdownItems: [
        { label: 'Product List', path: '/products', icon: '📋' },
        { label: 'Add New Product', path: '/products/add', icon: '➕' },
        { label: 'Edit Products', path: '/products/manage', icon: '✏️' }
      ]
    },
    {
      id: 'categories',
      title: 'Category Management',
      description: 'Create and manage product categories',
      icon: '📂',
      color: 'green',
      mainAction: { label: 'Manage Categories', path: '/categories' },
      dropdownItems: [
        { label: 'Category Management', path: '/categories', icon: '📂' }
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      color: 'purple',
      mainAction: { label: 'Manage Users', path: '/user' },
      dropdownItems: [
        { label: 'User Management', path: '/user', icon: '👥' }
      ]
    },
    {
      id: 'orders',
      title: 'Order Management',
      description: 'Track and process orders',
      icon: '🛒',
      color: 'orange',
      mainAction: { label: 'Manage Orders', path: '/orders' },
      dropdownItems: [
        { label: 'All Orders', path: '/orders', icon: '📋' },
        { label: 'Pending Orders', path: '/orders/pending', icon: '⏳' },
        { label: 'Completed Orders', path: '/orders/completed', icon: '✅' },
        { label: 'Returns', path: '/orders/returns', icon: '↩️' }
      ]
    },
    {
      id: 'analytics',
      title: 'Reports & Analytics',
      description: 'View sales reports and data analysis',
      icon: '📈',
      color: 'indigo',
      mainAction: { label: 'View Analytics', path: '/analytics/sales' },
      dropdownItems: [
        { label: 'Sales Analytics', path: '/analytics/sales', icon: '💰' },
        { label: 'Product Analytics', path: '/analytics/products', icon: '📦' },
        { label: 'User Analytics', path: '/analytics/users', icon: '👥' },
        { label: 'Reports', path: '/analytics/reports', icon: '📊' }
      ]
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure system parameters',
      icon: '⚙️',
      color: 'gray',
      mainAction: { label: 'System Settings', path: '/settings/general' },
      dropdownItems: [
        { label: 'General Settings', path: '/settings/general', icon: '⚙️' },
        { label: 'Security Settings', path: '/settings/security', icon: '🔒' },
        { label: 'Database Config', path: '/settings/database', icon: '🗄️' },
        { label: 'API Settings', path: '/settings/api', icon: '🔌' }
      ]
    }
  ];

  const toggleDropdown = (moduleId) => {
    setOpenDropdown(openDropdown === moduleId ? null : moduleId);
  };

  return (
    <div className={styles.dashboardPage}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user?.fullName || user?.username || 'Admin'}! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Comprehensive sales system management from this dashboard.
          </p>
        </div>
        <div className={styles.userBadge}>
          <span className={styles.roleBadge}>
            👑 Administrator
          </span>
        </div>
      </div>

      {/* Management Modules */}
      <div className={styles.modulesSection}>
        <h2 className={styles.sectionTitle}>System Management</h2>
        <div className={styles.modulesGrid}>
          {managementModules.map((module) => (
              <div 
                className={`${styles.moduleCard} ${styles[module.color]} ${openDropdown === module.id ? styles.expanded : ''}`}
                onClick={() => toggleDropdown(module.id)}
              >
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleIcon}>{module.icon}</div>
                  <div className={styles.moduleInfo}>
                    <h3 className={styles.moduleTitle}>{module.title}</h3>
                    <p className={styles.moduleDescription}>{module.description}</p>
                  </div>
                  <div className={`${styles.expandIndicator} ${openDropdown === module.id ? styles.rotated : ''}`}>
                    ▼
                  </div>
                </div>
                
                {openDropdown === module.id && (
                  <div className={styles.dropdownSection}>
                    <div className={styles.dropdownItems}>
                      {module.dropdownItems.map((item, index) => (
                        <button
                          key={index}
                          className={styles.dropdownItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(item.path);
                            setOpenDropdown(null);
                          }}
                        >
                          <span className={styles.itemIcon}>{item.icon}</span>
                          <span className={styles.itemText}>{item.label}</span>
                          <span className={styles.itemArrow}>→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Overview Statistics</h2>
        <div className={styles.quickStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.products}</div>
              <div className={styles.statLabel}>Total Products</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🛒</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.orders}</div>
              <div className={styles.statLabel}>Orders</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{stats.users}</div>
              <div className={styles.statLabel}>Users</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>${stats.revenue.toLocaleString()}</div>
              <div className={styles.statLabel}>Revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;