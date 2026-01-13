import { Button } from './button.jsx';

/**
 * ActionButton - Specialized button for CRUD operations
 * Pre-configured with common action patterns
 */

// Action button configurations
const ACTION_CONFIGS = {
  add: {
    icon: '➕',
    variant: 'primary',
    defaultText: 'Add'
  },
  edit: {
    icon: '✏️',
    variant: 'secondary',
    defaultText: 'Edit'
  },
  delete: {
    icon: '🗑️',
    variant: 'danger',
    defaultText: 'Delete'
  },
  export: {
    icon: '📊',
    variant: 'outline',
    defaultText: 'Export'
  },
  import: {
    icon: '📥',
    variant: 'outline',
    defaultText: 'Import'
  },
  save: {
    icon: '💾',
    variant: 'primary',
    defaultText: 'Save'
  },
  cancel: {
    icon: '❌',
    variant: 'ghost',
    defaultText: 'Cancel'
  },
  retry: {
    icon: '🔄',
    variant: 'outline',
    defaultText: 'Retry'
  },
  refresh: {
    icon: '🔄',
    variant: 'ghost',
    defaultText: 'Refresh'
  },
  security: {
    icon: '🔒',
    variant: 'outline',
    defaultText: 'Security'
  }
};

function ActionButton({
  action,
  children,
  text,
  variant,
  icon,
  ...props
}) {
  const config = ACTION_CONFIGS[action];

  if (!config) {
    console.warn(`Unknown action: ${action}. Available actions:`, Object.keys(ACTION_CONFIGS));
    return (
      <Button variant={variant} icon={icon} {...props}>
        {children || text}
      </Button>
    );
  }

  return (
    <Button
      variant={variant || config.variant}
      icon={icon || config.icon}
      {...props}
    >
      {children || text || config.defaultText}
    </Button>
  );
}

export { ActionButton, ACTION_CONFIGS };