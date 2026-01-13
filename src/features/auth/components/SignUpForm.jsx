import { useState } from 'react';
import { Button } from '../../../shared/ui/button.jsx';
import SocialLoginSection from './SocialLoginSection.jsx';
import styles from './SignUpForm.module.css';

function SignUpForm({
  formData,
  loading,
  onFormDataChange,
  onSubmit,
  onSocialLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    setTimeout(() => {
      try {
        if (onSubmit) {
          onSubmit();
        }
      } catch (error) {
        // Silent error handling
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.signUpContainer}>
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
        {/* Sign Up Form */}
        <div className={styles.signUpForm}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="name"
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>



          {/* Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
                className={styles.input}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword || ''}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
                className={styles.input}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                className={styles.checkbox}
                checked={formData.agreeToTerms || false}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                required
              />
              <span className={styles.checkboxText}>
                I agree to the <a href="/terms" className={styles.link}>Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>


        </div>
      </div>
    </div>
  );
}

export default SignUpForm;