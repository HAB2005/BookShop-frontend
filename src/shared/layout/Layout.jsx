import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../hooks/useAuth';
import { useLayout } from '../../app/providers';
import styles from './Layout.module.css';

function Layout({ children }) {
  const { user } = useAuth();
  const { pageTitle, breadcrumbs } = useLayout();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    setSidebarOpen(!sidebarOpen);

    // Remove transition class after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const closeSidebar = () => {
    setIsTransitioning(true);
    setSidebarOpen(false);

    // Remove transition class after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className={`${styles.layout} ${!isAdmin ? styles.noSidebar : ''}`}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && isAdmin && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}

      {/* Sidebar - Only for Admin */}
      {isAdmin && (
        <Sidebar
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
      )}

      <main className={`${styles.mainContent} ${isMobile && sidebarOpen && isAdmin ? styles.shifted : ''} ${isTransitioning ? styles.transitioning : ''}`}>
        <TopBar
          title={pageTitle}
          breadcrumbs={breadcrumbs}
          onMenuClick={isAdmin ? toggleSidebar : null}
          isMobile={isMobile}
          showMenuButton={isAdmin}
        />
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;