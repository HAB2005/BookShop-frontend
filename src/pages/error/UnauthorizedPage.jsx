import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/button.jsx';
import styles from './ErrorPage.module.css';

function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <span>🚫</span>
        </div>

        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>Access Denied</h1>
          <h2 className={styles.errorSubtitle}>403 - Unauthorized</h2>
          <p className={styles.errorMessage}>
            You don't have permission to access this page.
            Please contact your administrator if you believe this is an error.
          </p>

          <div className={styles.errorActions}>
            <Button
              variant="outline"
              onClick={handleGoBack}
              className={styles.actionButton}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={handleGoHome}
              className={styles.actionButton}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={styles.actionButton}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;