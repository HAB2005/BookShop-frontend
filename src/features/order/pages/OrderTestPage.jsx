import { useState } from 'react';
import { useCheckout } from '../hooks/useCheckout.js';
import { usePayment } from '../../payment/hooks/usePayment.js';
import { PAYMENT_METHOD } from '../../payment/api/payment.api.js';
import PaymentMethodSelector from '../../payment/components/PaymentMethodSelector.jsx';
import { Button } from '../../../shared/ui/button.jsx';
import { useToast } from '../../../shared/hooks/useToast.js';
import styles from './OrderTestPage.module.css';

function OrderTestPage() {
  const { showToast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHOD.FAKE);
  const [paymentData, setPaymentData] = useState({});
  const [testResults, setTestResults] = useState([]);
  
  const { 
    checkoutCart,
    checkoutWithPayment, 
    processPayment,
    loading: checkoutLoading 
  } = useCheckout();

  const { 
    getPaymentByOrder,
    loading: paymentLoading 
  } = usePayment();

  const addTestResult = (result) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...result
    }]);
  };

  const testSimpleCheckout = async () => {
    try {
      const result = await checkoutCart();
      addTestResult({
        test: 'Simple Checkout',
        status: 'success',
        data: result
      });
    } catch (error) {
      addTestResult({
        test: 'Simple Checkout',
        status: 'error',
        error: error.message
      });
    }
  };

  const testCheckoutWithPayment = async () => {
    try {
      const checkoutData = {
        paymentMethod: selectedPaymentMethod,
        ...paymentData
      };
      
      const result = await checkoutWithPayment(checkoutData);
      addTestResult({
        test: 'Checkout with Payment',
        status: 'success',
        data: result
      });
    } catch (error) {
      addTestResult({
        test: 'Checkout with Payment',
        status: 'error',
        error: error.message
      });
    }
  };

  const testProcessPayment = async () => {
    const orderId = prompt('Enter Order ID to process payment:');
    if (!orderId) return;

    try {
      const paymentData = {
        orderId: parseInt(orderId),
        method: selectedPaymentMethod
      };
      
      const result = await processPayment(paymentData);
      addTestResult({
        test: 'Process Payment',
        status: 'success',
        data: result
      });
    } catch (error) {
      addTestResult({
        test: 'Process Payment',
        status: 'error',
        error: error.message
      });
    }
  };

  const testGetPaymentByOrder = async () => {
    const orderId = prompt('Enter Order ID to get payment:');
    if (!orderId) return;

    try {
      const result = await getPaymentByOrder(parseInt(orderId));
      addTestResult({
        test: 'Get Payment by Order',
        status: 'success',
        data: result
      });
    } catch (error) {
      addTestResult({
        test: 'Get Payment by Order',
        status: 'error',
        error: error.message
      });
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Order & Payment Test Page</h1>
        <p className={styles.subtitle}>
          Test order and payment functionality
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.testSection}>
          <h2>Payment Method Selection</h2>
          <PaymentMethodSelector
            selectedMethod={selectedPaymentMethod}
            onMethodChange={setSelectedPaymentMethod}
            onPaymentDataChange={setPaymentData}
          />
        </div>

        <div className={styles.testSection}>
          <h2>Test Actions</h2>
          <div className={styles.buttonGrid}>
            <Button
              onClick={testSimpleCheckout}
              loading={checkoutLoading}
              disabled={checkoutLoading || paymentLoading}
            >
              Test Simple Checkout
            </Button>
            
            <Button
              onClick={testCheckoutWithPayment}
              loading={checkoutLoading}
              disabled={checkoutLoading || paymentLoading}
            >
              Test Checkout with Payment
            </Button>
            
            <Button
              onClick={testProcessPayment}
              loading={checkoutLoading}
              disabled={checkoutLoading || paymentLoading}
            >
              Test Process Payment
            </Button>
            
            <Button
              onClick={testGetPaymentByOrder}
              loading={paymentLoading}
              disabled={checkoutLoading || paymentLoading}
            >
              Test Get Payment by Order
            </Button>
          </div>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h2>Test Results</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={clearResults}
            >
              Clear Results
            </Button>
          </div>
          
          <div className={styles.resultsList}>
            {testResults.length === 0 ? (
              <p className={styles.noResults}>No test results yet. Run some tests above.</p>
            ) : (
              testResults.map((result) => (
                <div 
                  key={result.id} 
                  className={`${styles.resultItem} ${styles[result.status]}`}
                >
                  <div className={styles.resultHeader}>
                    <span className={styles.testName}>{result.test}</span>
                    <span className={styles.timestamp}>{result.timestamp}</span>
                    <span className={`${styles.status} ${styles[result.status]}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {result.data && (
                    <div className={styles.resultData}>
                      <strong>Result:</strong>
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  )}
                  
                  {result.error && (
                    <div className={styles.resultError}>
                      <strong>Error:</strong>
                      <p>{result.error}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTestPage;