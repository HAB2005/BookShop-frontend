import styles from './Button.module.css';

function Button({
  children,
  label,
  icon,
  variant = "primary",
  size = "medium",
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  // Get spinner size class
  const getSpinnerSizeClass = () => {
    switch (size) {
      case 'small': return styles.spinnerSmall;
      case 'medium': return styles.spinnerMedium;
      case 'large': return styles.spinnerLarge;
      default: return styles.spinnerMedium;
    }
  };

  // Combine CSS classes
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <div 
          className={`${styles.spinner} ${getSpinnerSizeClass()}`}
        />
      )}
      {!loading && icon && (
        <span className={styles.icon}>{icon}</span>
      )}
      {(children || label) && (
        <span className={styles.content}>{children || label}</span>
      )}
    </button>
  );
}

export { Button };
