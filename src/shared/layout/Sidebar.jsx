import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({ userRole = 'admin', isMobile = false, isOpen = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false); // Always expanded on mobile when open
    }
  }, [isMobile]);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: '👥',
      path: '/user',
      active: location.pathname.startsWith('/user')
    },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      path: '/products',
      active: location.pathname.startsWith('/products'),
      subItems: [
        { label: 'Product List', path: '/products' },
        { label: 'Edit Products', path: '/products/edit-list' },
        { label: 'Add Product', path: '/products/add' }
      ]
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: '📂',
      path: '/categories',
      active: location.pathname.startsWith('/categories')
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '🛒',
      path: '/orders',
      active: location.pathname.startsWith('/orders'),
      subItems: [
        { label: 'All Orders', path: '/orders' },
        { label: 'Pending Orders', path: '/orders/pending' },
        { label: 'Completed Orders', path: '/orders/completed' },
        { label: 'Order Reports', path: '/orders/reports' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics',
      active: location.pathname.startsWith('/analytics'),
      subItems: [
        { label: 'Sales Analytics', path: '/analytics/sales' },
        { label: 'Product Analytics', path: '/analytics/products' },
        { label: 'User Analytics', path: '/analytics/users' },
        { label: 'Reports', path: '/analytics/reports' }
      ]
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: '👤',
      path: '/profile',
      active: location.pathname === '/profile'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: '⚙️',
      path: '/settings',
      active: location.pathname.startsWith('/settings'),
      subItems: [
        { label: 'General Settings', path: '/settings/general' },
        { label: 'Security Settings', path: '/settings/security' },
        { label: 'Database Config', path: '/settings/database' },
        { label: 'API Settings', path: '/settings/api' }
      ]
    }
  ];

  // Auto-expand active menu items
  useEffect(() => {
    const activeItem = menuItems.find(item => item.active && item.subItems);
    if (activeItem) {
      setExpandedMenus(prev => new Set([...prev, activeItem.id]));
    }
  }, [location.pathname]);

  const handleMenuClick = (path, hasSubItems = false, itemId = null) => {
    if (hasSubItems && !isCollapsed) {
      // Toggle submenu
      const newExpanded = new Set(expandedMenus);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      setExpandedMenus(newExpanded);
    } else {
      // Navigate to path
      navigate(path);
      // Close sidebar on mobile after navigation
      if (isMobile && onClose) {
        onClose();
      }
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobile ? styles.mobile : ''} ${isMobile && isOpen ? styles.open : ''}`}>
      {/* Mobile Close Button */}
      {isMobile && (
        <button className={styles.mobileCloseButton} onClick={onClose}>
          ✕
        </button>
      )}
      
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <span>S</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className={styles.logoText}>
              <h3>SOMS</h3>
              <p>Sales Order Management</p>
            </div>
          )}
        </div>
        
        {!isMobile && (
          <button 
            className={styles.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={styles.sidebarNav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                className={`${styles.menuButton} ${item.active ? styles.active : ''}`}
                onClick={() => handleMenuClick(item.path, !!item.subItems, item.id)}
                title={isCollapsed ? item.label : ''}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                {(!isCollapsed || isMobile) && (
                  <span className={styles.menuLabel}>{item.label}</span>
                )}
                {item.subItems && (!isCollapsed || isMobile) && (
                  <span className={styles.expandIcon}>
                    {expandedMenus.has(item.id) ? '▼' : '▶'}
                  </span>
                )}
                {item.active && <div className={styles.activeIndicator}></div>}
              </button>
              
              {/* Submenu */}
              {item.subItems && expandedMenus.has(item.id) && (!isCollapsed || isMobile) && (
                <ul className={styles.subMenuList}>
                  {item.subItems.map((subItem, index) => (
                    <li key={index} className={styles.subMenuItem}>
                      <button
                        className={`${styles.subMenuButton} ${location.pathname === subItem.path ? styles.active : ''}`}
                        onClick={() => handleMenuClick(subItem.path)}
                      >
                        <span className={styles.subMenuLabel}>{subItem.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - chỉ giữ logout button */}
      <div className={styles.sidebarFooter}>
        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
          title={isCollapsed && !isMobile ? 'Logout' : ''}
        >
          <span className={styles.logoutIcon}>🚪</span>
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;