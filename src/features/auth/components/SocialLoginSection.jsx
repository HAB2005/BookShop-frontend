import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../../../shared/ui/button.jsx';
import { getPrimarySocialProviders, getSecondarySocialProviders } from '../constants/socialProviders.js';
import styles from './LoginForm.module.css';

function SocialLoginSection({ onSocialLogin }) {
  const primaryProviders = getPrimarySocialProviders();
  const secondaryProviders = getSecondarySocialProviders();

  // Google login hook
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // With implicit flow, we get access_token directly
      if (onSocialLogin) {
        onSocialLogin('google', { accessToken: tokenResponse.access_token });
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
    },
    flow: 'implicit', // Use implicit flow to get access token directly
    // Use popup for better UX (warnings are harmless)
    ux_mode: 'popup',
    select_account: true,
  });

  const handleSocialLogin = (providerId) => {
    if (providerId === 'google') {
      try {
        googleLogin();
      } catch (error) {
        console.error('Failed to initiate Google login:', error);
      }
      return;
    }

    if (onSocialLogin) {
      onSocialLogin(providerId);
    } else {
      // Default behavior - placeholder
      console.log(`${providerId} login clicked`);

      // TODO: Implement actual social login
      switch (providerId) {
        case 'phone':
          // Navigate to phone login page or show phone input
          break;
        case 'facebook':
          // window.location.href = '/auth/facebook';
          break;
        case 'apple':
          // window.location.href = '/auth/apple';
          break;
        default:
          console.warn(`Unknown social provider: ${providerId}`);
      }
    }
  };

  return (
    <div className={styles.socialLogin}>
      {/* Primary Social Login Buttons */}
      {primaryProviders.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant={provider.variant}
          size={provider.size}
          onClick={() => handleSocialLogin(provider.id)}
          className={styles[`${provider.id}Button`]}
        >
          <span className={styles[`${provider.id}Icon`]}>{provider.icon}</span>
          {provider.label}
        </Button>
      ))}

      {/* Secondary Social Login Buttons */}
      <div className={styles.socialRow}>
        {secondaryProviders.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant={provider.variant}
            size={provider.size}
            onClick={() => handleSocialLogin(provider.id)}
            className={styles.socialButton}
          >
            <span className={styles.socialIcon}>{provider.icon}</span>
            {provider.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default SocialLoginSection;