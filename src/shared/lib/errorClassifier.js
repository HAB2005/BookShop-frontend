export const getErrorClass = (errorMessage, styles) => {
  if (!errorMessage) return '';
  
  const message = errorMessage.toLowerCase();
  
  if (message.includes('connect') || message.includes('network') || message.includes('internet')) {
    return `${styles.errorMessage} ${styles.networkError}`;
  } else if (message.includes('server') || message.includes('unexpected')) {
    return `${styles.errorMessage} ${styles.serverError}`;
  } else if (message.includes('username:') || message.includes('password:') || message.includes('required') || message.includes('characters')) {
    return `${styles.errorMessage} ${styles.validationError}`;
  } else {
    return styles.errorMessage;
  }
};

export const getErrorType = (errorMessage) => {
  if (!errorMessage) return 'general';
  
  const message = errorMessage.toLowerCase();
  
  if (message.includes('connect') || message.includes('network') || message.includes('internet')) {
    return 'network';
  } else if (message.includes('server') || message.includes('unexpected')) {
    return 'server';
  } else if (message.includes('username:') || message.includes('password:') || message.includes('required') || message.includes('characters')) {
    return 'validation';
  } else {
    return 'general';
  }
};