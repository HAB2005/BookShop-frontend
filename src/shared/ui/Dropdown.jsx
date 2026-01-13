import { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

function Dropdown({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select option",
  className = "",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div 
      className={`${styles.dropdown} ${className} ${disabled ? styles.disabled : ''}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`${styles.dropdownButton} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.dropdownText}>{displayText}</span>
        <span className={`${styles.dropdownArrow} ${isOpen ? styles.rotated : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu} role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.dropdownItem} ${
                option.value === value ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;