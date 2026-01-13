import { Button } from './button.jsx';

/**
 * IconButton - Button with only icon, optimized for compact spaces
 * Perfect for action buttons in tables, cards, toolbars
 */
function IconButton({ 
  icon, 
  children,
  variant = "ghost", 
  size = "small",
  title,
  'aria-label': ariaLabel,
  ...props 
}) {
  return (
    <Button
      variant={variant}
      size={size}
      title={title || ariaLabel}
      aria-label={ariaLabel || title}
      {...props}
    >
      {icon || children}
    </Button>
  );
}

export { IconButton };