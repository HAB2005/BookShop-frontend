import styles from './PriceDisplay.module.css';

function PriceDisplay({ 
  price, 
  originalPrice, 
  currency = 'VND', 
  locale = 'vi-VN',
  size = 'medium',
  showDiscount = true 
}) {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - price / originalPrice) * 100) 
    : 0;

  return (
    <div className={`${styles.priceDisplay} ${styles[size]}`}>
      <span className={styles.currentPrice}>
        {formatPrice(price)}
      </span>
      
      {hasDiscount && (
        <>
          <span className={styles.originalPrice}>
            {formatPrice(originalPrice)}
          </span>
          {showDiscount && (
            <span className={styles.discount}>
              -{discountPercentage}%
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default PriceDisplay;