import { Button } from '../../../shared/ui/button.jsx';
import SocialLoginSection from './SocialLoginSection.jsx';
import styles from './LoginForm.module.css';

function LoginForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSocialLogin,
  onForgotPassword,
}) {
  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      console.log('Forgot password clicked');
      // TODO: Navigate to forgot password page
    }
  };

  const handleSubmit = () => {
    console.log('LoginForm handleSubmit called');

    // Use setTimeout to ensure this runs after any potential form submission
    setTimeout(() => {
      try {
        if (onSubmit) {
          onSubmit();
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      }
    }, 0);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftColumn}>
        {/* Social Login Options */}
        <SocialLoginSection onSocialLogin={onSocialLogin} />
      </div>

      {/* Vertical Divider */}
      <div className={styles.verticalDivider}>
        <span className={styles.dividerLine}></span>
        <span className={styles.dividerText}>or</span>
        <span className={styles.dividerLine}></span>
      </div>

      <div className={styles.rightColumn}>
        {/* Traditional Login Form */}
        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                console.log('Email changed to:', e.target.value);
                onEmailChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  console.log('Enter pressed in email field');
                  handleSubmit();
                }
              }}
              autoComplete="email"
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                console.log('Password changed to:', e.target.value);
                onPasswordChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  console.log('Enter pressed in password field');
                  handleSubmit();
                }
              }}
              autoComplete="current-password"
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember me & Forgot password */}
          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkboxText}>Remember me</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={handleForgotPassword}
              className={styles.forgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          {/* Sign In Button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button mousedown triggered');
              console.log('Current email value:', email);
              console.log('Current password value:', password);
              handleSubmit();
            }}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: loading ? '#999' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: '1rem'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;