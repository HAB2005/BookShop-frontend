// Console blocker - Load this BEFORE any other scripts
(function() {
  'use strict';
  
  // Only run in development
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }
  
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
    'cross-origin-opener-policy',
    'window.closed call',
    'received cereal',
    'access_token',
    'ya29.',
    'authresult',
    'fireidpevent',
    'bearer ',
    'token_type',
    'expires_in',
    'scope',
    'clientid',
    'authuser',
    'prompt'
  ];
  
  // Check if message should be blocked
  function shouldBlock(message) {
    const lowerMessage = String(message).toLowerCase();
    return blockedPatterns.some(pattern => lowerMessage.includes(pattern));
  }
  
  // Override console methods
  console.log = function(...args) {
    const message = args.join(' ');
    if (!shouldBlock(message)) {
      originalConsole.log.apply(console, args);
    }
  };
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (!shouldBlock(message)) {
      originalConsole.error.apply(console, args);
    }
  };
  
  console.warn = function(...args) {
    const message = args.join(' ');
    if (!shouldBlock(message)) {
      originalConsole.warn.apply(console, args);
    }
  };
  
  console.info = function(...args) {
    const message = args.join(' ');
    if (!shouldBlock(message)) {
      originalConsole.info.apply(console, args);
    }
  };
  
  console.debug = function(...args) {
    const message = args.join(' ');
    if (!shouldBlock(message)) {
      originalConsole.debug.apply(console, args);
    }
  };
  
})();