import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/button.jsx';
import styles from './ErrorPage.module.css';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <span>🔍</span>
        </div>
        
        <div className={styles.errorContent}>
          <h1 className={styles.errorTitle}>Page Not Found</h1>
          <h2 className={styles.errorSubtitle}>404 - Not Found</h2>
          <p className={styles.errorMessage}>
            The page you're looking for doesn't exist or has been moved.
            Please check the URL or navigate back to a valid page.
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;