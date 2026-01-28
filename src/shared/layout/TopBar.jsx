import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './TopBar.module.css';

function TopBar({ title = "Dashboard", breadcrumbs = [], onMenuClick, isMobile = false, showMenuButton = true }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNavigationDropdown, setShowNavigationDropdown] = useState(false);

  const notificationRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigationDropdownRef = useRef(null);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }

      if (showUserDropdown && userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }

      if (showNavigationDropdown && navigationDropdownRef.current && !navigationDropdownRef.current.contains(event.target)) {
        setShowNavigationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserDropdown, showNavigationDropdown]);

  // Mock notifications data
  const notifications = [
    { id: 1, type: 'order', message: 'New order #1234 received', time: '2 min ago' },
    { id: 2, type: 'product', message: 'Product "iPhone 15" low stock', time: '5 min ago' },
    { id: 3, type: 'user', message: 'New user registration', time: '10 min ago' }
  ];

  // Navigation items for customers
  const customerNavItems = [
    { label: 'Products', icon: '💎', path: '/products' },
    { label: 'My Orders', icon: '📦', path: '/orders' },
    { label: 'Order History', icon: '📋', path: '/orders' }, // Tạm thời redirect đến /orders
    { label: 'Favorites', icon: '❤️', path: '/favorites' },
    { label: 'Shopping Cart', icon: '🛍️', path: '/cart' }
  ];

  // Navigation items for admin
  const adminNavItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'User Management', icon: '👥', path: '/user' },
    { label: 'Products', icon: '📦', path: '/products' },
    { label: 'Categories', icon: '📂', path: '/categories' },
    { label: 'Stock Management', icon: '📦', path: '/stock' },
    { label: 'Orders', icon: '🛒', path: '/orders' },
    { label: 'Analytics', icon: '📈', path: '/analytics' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileAction = (action) => {
    setShowUserDropdown(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/profile');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleNavigationClick = (path) => {
    navigate(path);
    setShowNavigationDropdown(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(false);
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        {/* Mobile Hamburger Menu - Only for Admin */}
        {isMobile && showMenuButton && (
          <button className={styles.hamburgerButton} onClick={onMenuClick}>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        )}

        {/* Customer Navigation Dropdown */}
        {isCustomer && (
          <div className={styles.navigationWrapper} ref={navigationDropdownRef}>
            <button
              className={styles.navigationButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowNavigationDropdown(!showNavigationDropdown);
              }}
            >
              <span className={styles.navigationIcon}>☰</span>
              <span className={styles.navigationText}>Menu</span>
              <span className={`${styles.dropdownArrow} ${showNavigationDropdown ? styles.rotated : ''}`}>▼</span>
            </button>

            {showNavigationDropdown && (
              <div className={styles.navigationDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.navigationHeader}>
                  <h4>Navigation</h4>
                </div>
                <div className={styles.navigationList}>
                  {customerNavItems.map((item, index) => (
                    <button
                      key={index}
                      className={styles.navigationItem}
                      onClick={() => handleNavigationClick(item.path)}
                    >
                      <span className={styles.navItemIcon}>{item.icon}</span>
                      <span className={styles.navItemLabel}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Navigation Dropdown */}
        {isAdmin && (
          <div className={styles.navigationWrapper} ref={navigationDropdownRef}>
            <button
              className={styles.navigationButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowNavigationDropdown(!showNavigationDropdown);
              }}
            >
              <span className={styles.navigationIcon}>☰</span>
              <span className={styles.navigationText}>Admin Menu</span>
              <span className={`${styles.dropdownArrow} ${showNavigationDropdown ? styles.rotated : ''}`}>▼</span>
            </button>

            {showNavigationDropdown && (
              <div className={styles.navigationDropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.navigationHeader}>
                  <h4>Admin Navigation</h4>
                </div>
                <div className={styles.navigationList}>
                  {adminNavItems.map((item, index) => (
                    <button
                      key={index}
                      className={styles.navigationItem}
                      onClick={() => handleNavigationClick(item.path)}
                    >
                      <span className={styles.navItemIcon}>{item.icon}</span>
                      <span className={styles.navItemLabel}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Breadcrumbs or Title */}
        {breadcrumbs.length > 0 ? (
          <nav className={styles.breadcrumb}>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className={styles.breadcrumbItem}>
                {typeof crumb === 'string' ? crumb : crumb.label}
                {index < breadcrumbs.length - 1 && (
                  <span className={styles.breadcrumbSeparator}>/</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className={styles.pageTitle}>{title}</h1>
        )}
      </div>

      <div className={styles.rightSection}>
        {/* Quick Actions for Customers */}
        {isCustomer && (
          <div className={styles.quickActions}>
            <button
              className={styles.quickActionButton}
              onClick={() => navigate('/cart')}
              title="Shopping Cart"
            >
              <span className={styles.quickActionIcon}>🛒</span>
            </button>
            <button
              className={styles.quickActionButton}
              onClick={() => navigate('/favorites')}
              title="Favorites"
            >
              <span className={styles.quickActionIcon}>❤️</span>
            </button>
          </div>
        )}

        {/* Quick Actions for Admin */}
        {isAdmin && (
          <div className={styles.quickActions}>
            <button
              className={styles.quickActionButton}
              onClick={() => navigate('/stock')}
              title="Stock Management"
            >
              <span className={styles.quickActionIcon}>📦</span>
            </button>
            <button
              className={styles.quickActionButton}
              onClick={() => navigate('/dashboard')}
              title="Dashboard"
            >
              <span className={styles.quickActionIcon}>📊</span>
            </button>
          </div>
        )}

        {/* Notifications */}
        <div className={styles.notificationWrapper} ref={notificationRef}>
          <button
            className={styles.notificationButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            <span className={styles.notificationIcon}>🔔</span>
            {notifications.length > 0 && (
              <span className={styles.notificationBadge}>{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationDropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.notificationHeader}>
                <h4>Notifications</h4>
                <span className={styles.notificationCount}>{notifications.length} new</span>
              </div>
              <div className={styles.notificationList}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={styles.notificationItem}
                    onClick={handleNotificationClick}
                  >
                    <div className={styles.notificationContent}>
                      <p>{notif.message}</p>
                      <span className={styles.notificationTime}>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.notificationFooter}>
                <button onClick={() => setShowNotifications(false)}>
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className={styles.userProfileWrapper} ref={userDropdownRef}>
          <button
            className={styles.userProfileButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowUserDropdown(!showUserDropdown);
            }}
          >
            <div className={styles.userAvatar}>
              <span>{user?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || '👤'}</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.fullName || user?.username || 'User'}</span>
            </div>
            <span className={`${styles.dropdownArrow} ${showUserDropdown ? styles.rotated : ''}`}>▼</span>
          </button>

          {showUserDropdown && (
            <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.userAvatarLarge}>
                  <span>{user?.fullName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || '👤'}</span>
                </div>
                <div className={styles.userDetails}>
                  <h4>{user?.fullName || user?.username || 'User'}</h4>
                  <p>{user?.email || user?.username || 'user@soms.com'}</p>
                  <span className={styles.roleBadge}>
                    {isAdmin ? '👑 Administrator' : '👤 Customer'}
                  </span>
                </div>
              </div>

              <div className={styles.userDropdownMenu}>
                <button
                  className={styles.userMenuItem}
                  onClick={() => handleProfileAction('profile')}
                >
                  <span className={styles.menuItemIcon}>👤</span>
                  <span>View Profile</span>
                </button>
                <button
                  className={styles.userMenuItem}
                  onClick={() => handleProfileAction('settings')}
                >
                  <span className={styles.menuItemIcon}>⚙️</span>
                  <span>Account Settings</span>
                </button>
                <div className={styles.menuDivider}></div>
                <button
                  className={`${styles.userMenuItem} ${styles.logoutMenuItem}`}
                  onClick={() => handleProfileAction('logout')}
                >
                  <span className={styles.menuItemIcon}>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;