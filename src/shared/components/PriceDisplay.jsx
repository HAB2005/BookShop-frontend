import styles from './PriceDisplay.module.css';

function PriceDisplay({ price, className = '', currency = 'VND', locale = 'vi-VN' }) {
  const formatPrice = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <span className={`${styles.priceDisplay} ${className}`}>
      {formatPrice(price)}
    </span>
  );
}

export default PriceDisplay;