import { useState } from 'react';
import styles from './QuantitySelector.module.css';

function QuantitySelector({ 
  value = 1, 
  onChange, 
  min = 1, 
  max = 99, 
  disabled = false,
  size = 'medium' 
}) {
  const [inputValue, setInputValue] = useState(value);

  const handleDecrease = () => {
    const newValue = Math.max(min, value - 1);
    onChange(newValue);
    setInputValue(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
    setInputValue(newValue);
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    setInputValue(newValue);
    onChange(clampedValue);
  };

  const handleInputBlur = () => {
    setInputValue(value);
  };

  return (
    <div className={`${styles.quantitySelector} ${styles[size]} ${disabled ? styles.disabled : ''}`}>
      <button
        type="button"
        className={styles.decreaseButton}
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        -
      </button>
      
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={styles.quantityInput}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        className={styles.increaseButton}
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;