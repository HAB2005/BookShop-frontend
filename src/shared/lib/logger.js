// Logger utility - Override console methods IMMEDIATELY to block all unwanted logs
const isDevelopment = import.meta.env.MODE === 'development';

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

// Patterns to block
const blockedPatterns = [
  'Cross-Origin-Opener-Policy',
  'window.closed call',
  'RECEIVED CEREAL',
  'access_token',
  'ya29.',
  'authResult',
  'fireIdpEvent',
  'Bearer ',
  'token_type',
  'expires_in',
  'scope',
  'clientId',
  'authuser',
  'prompt'
];

// Check if message should be blocked
const shouldBlock = (message) => {
  return blockedPatterns.some(pattern =>
    message.toLowerCase().includes(pattern.toLowerCase())
  );
};

// Filter sensitive data from logs
const filterSensitiveData = (data) => {
  if (typeof data === 'string') {
    let filtered = data;
    // Replace sensitive patterns
    filtered = filtered.replace(/access_token['":\s]*['"]\s*([^'"]+)['"]/gi, 'access_token: "[REDACTED]"');
    filtered = filtered.replace(/token['":\s]*['"]\s*([^'"]+)['"]/gi, 'token: "[REDACTED]"');
    filtered = filtered.replace(/Bearer\s+[A-Za-z0-9\-_\.]+/gi, 'Bearer [REDACTED]');
    filtered = filtered.replace(/ya29\.[A-Za-z0-9\-_\.]+/gi, '[TOKEN_REDACTED]');
    return filtered;
  }

  if (typeof data === 'object' && data !== null) {
    const filtered = { ...data };
    const sensitiveFields = ['access_token', 'token', 'jwt', 'password', 'idToken', 'accessToken'];
    sensitiveFields.forEach(field => {
      if (filtered[field]) {
        filtered[field] = '[REDACTED]';
      }
    });
    return filtered;
  }

  return data;
};

// Override console methods immediately
console.log = (...args) => {
  if (!isDevelopment) return;

  const message = args.join(' ');
  if (shouldBlock(message)) return;

  const filteredArgs = args.map(arg => filterSensitiveData(arg));
  originalConsole.log.apply(console, filteredArgs);
};

console.error = (...args) => {
  if (!isDevelopment) return;

  const message = args.join(' ');
  if (shouldBlock(message)) return;

  const filteredArgs = args.map(arg => filterSensitiveData(arg));
  originalConsole.error.apply(console, filteredArgs);
};

console.warn = (...args) => {
  if (!isDevelopment) return;

  const message = args.join(' ');
  if (shouldBlock(message)) return;

  const filteredArgs = args.map(arg => filterSensitiveData(arg));
  originalConsole.warn.apply(console, filteredArgs);
};

console.info = (...args) => {
  if (!isDevelopment) return;

  const message = args.join(' ');
  if (shouldBlock(message)) return;

  const filteredArgs = args.map(arg => filterSensitiveData(arg));
  originalConsole.info.apply(console, filteredArgs);
};

console.debug = (...args) => {
  if (!isDevelopment) return;

  const message = args.join(' ');
  if (shouldBlock(message)) return;

  const filteredArgs = args.map(arg => filterSensitiveData(arg));
  originalConsole.debug.apply(console, filteredArgs);
};

// Export logger that uses filtered console
export const logger = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};