/**
 * Social login providers configuration
 */
export const SOCIAL_PROVIDERS = {
  GOOGLE: {
    id: 'google',
    name: 'Google',
    icon: '🔍',
    label: 'Continue with Google',
    variant: 'secondary',
    size: 'large'
  },
  PHONE: {
    id: 'phone',
    name: 'Phone',
    icon: '📱',
    label: 'Continue with Phone',
    variant: 'secondary',
    size: 'large'
  },
  FACEBOOK: {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    label: 'Facebook',
    variant: 'ghost',
    size: 'medium'
  },
  APPLE: {
    id: 'apple',
    name: 'Apple',
    icon: '🍎',
    label: 'Apple',
    variant: 'ghost',
    size: 'medium'
  }
};

/**
 * Get primary social providers (displayed prominently)
 */
export const getPrimarySocialProviders = () => [
  SOCIAL_PROVIDERS.GOOGLE,
  SOCIAL_PROVIDERS.PHONE
];

/**
 * Get secondary social providers (displayed in row)
 */
export const getSecondarySocialProviders = () => [
  SOCIAL_PROVIDERS.FACEBOOK,
  SOCIAL_PROVIDERS.APPLE
];