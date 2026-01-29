import { useState } from 'react';
import { PAYMENT_METHOD, PAYMENT_METHOD_LABELS } from '../api/payment.api.js';
import styles from './PaymentMethodSelector.module.css';

function PaymentMethodSelector({ selectedMethod, onMethodChange, onPaymentDataChange }) {
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        phoneNumber: '',
        email: ''
    });

    const handleMethodChange = (method) => {
        onMethodChange(method);
        // Clear payment data when method changes
        const clearedData = {
            cardNumber: '',
            cardHolderName: '',
            expiryDate: '',
            cvv: '',
            phoneNumber: '',
            email: ''
        };
        setPaymentData(clearedData);
        onPaymentDataChange(clearedData);
    };

    const handleInputChange = (field, value) => {
        const updatedData = { ...paymentData, [field]: value };
        setPaymentData(updatedData);
        onPaymentDataChange(updatedData);
    };

    const paymentMethods = [
        {
            value: PAYMENT_METHOD.FAKE,
            label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.FAKE],
            description: 'Instant payment for testing (will succeed immediately)',
            icon: '💳'
        },
        {
            value: PAYMENT_METHOD.COD,
            label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.COD],
            description: 'Pay when you receive your order',
            icon: '💵'
        },
        {
            value: PAYMENT_METHOD.MOMO,
            label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.MOMO],
            description: 'Pay with MoMo e-wallet',
            icon: '📱'
        },
        {
            value: PAYMENT_METHOD.VNPAY,
            label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.VNPAY],
            description: 'Pay with VNPay gateway',
            icon: '🏦'
        },
        {
            value: PAYMENT_METHOD.PAYPAL,
            label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.PAYPAL],
            description: 'Pay with PayPal account',
            icon: '🌐'
        }
    ];

    const renderPaymentFields = () => {
        switch (selectedMethod) {
            case PAYMENT_METHOD.MOMO:
                return (
                    <div className={styles.paymentFields}>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Phone Number</label>
                            <input
                                type="tel"
                                className={styles.fieldInput}
                                placeholder="Enter your phone number"
                                value={paymentData.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                        </div>
                    </div>
                );

            case PAYMENT_METHOD.VNPAY:
                return (
                    <div className={styles.paymentFields}>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Card Number</label>
                            <input
                                type="text"
                                className={styles.fieldInput}
                                placeholder="1234 5678 9012 3456"
                                value={paymentData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            />
                        </div>
                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Expiry Date</label>
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    placeholder="MM/YY"
                                    value={paymentData.expiryDate}
                                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>CVV</label>
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    placeholder="123"
                                    value={paymentData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>Card Holder Name</label>
                            <input
                                type="text"
                                className={styles.fieldInput}
                                placeholder="Enter cardholder name"
                                value={paymentData.cardHolderName}
                                onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                            />
                        </div>
                    </div>
                );

            case PAYMENT_METHOD.PAYPAL:
                return (
                    <div className={styles.paymentFields}>
                        <div className={styles.field}>
                            <label className={styles.fieldLabel}>PayPal Email</label>
                            <input
                                type="email"
                                className={styles.fieldInput}
                                placeholder="Enter your PayPal email"
                                value={paymentData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                );

            case PAYMENT_METHOD.FAKE:
                return (
                    <div className={styles.paymentFields}>
                        <div className={styles.fakePaymentInfo}>
                            <p>This is a test payment method. No actual payment will be processed.</p>
                            <p>The payment will be marked as successful immediately.</p>
                        </div>
                    </div>
                );

            case PAYMENT_METHOD.COD:
                return (
                    <div className={styles.paymentFields}>
                        <div className={styles.codInfo}>
                            <p>You will pay when you receive your order.</p>
                            <p>Please have the exact amount ready for the delivery person.</p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Select Payment Method</h3>

            <div className={styles.methodsList}>
                {paymentMethods.map((method) => (
                    <div
                        key={method.value}
                        className={`${styles.methodCard} ${selectedMethod === method.value ? styles.selected : ''
                            }`}
                        onClick={() => handleMethodChange(method.value)}
                    >
                        <div className={styles.methodHeader}>
                            <div className={styles.methodIcon}>{method.icon}</div>
                            <div className={styles.methodInfo}>
                                <h4 className={styles.methodLabel}>{method.label}</h4>
                                <p className={styles.methodDescription}>{method.description}</p>
                            </div>
                            <div className={styles.radioButton}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.value}
                                    checked={selectedMethod === method.value}
                                    onChange={() => handleMethodChange(method.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMethod && renderPaymentFields()}
        </div>
    );
}

export default PaymentMethodSelector;