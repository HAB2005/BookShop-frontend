import { useNavigate } from "react-router-dom";
import { useSignUp } from "../hooks/useSignUp";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import SignUpForm from "../components/SignUpForm";
import styles from './SignUpPage.module.css';

function SignUpPage() {
    const navigate = useNavigate();
    const {
        formData,
        setFormData,
        loading,
        errors,
        handleSignUp,
        handleSocialSignUp
    } = useSignUp();
    
    const { handleGoogleLogin, loading: googleLoading, error: googleError } = useGoogleAuth();

    const handleFormDataChange = (newFormData) => {
        setFormData(newFormData);
    };

    const handleSocialLogin = async (providerId, data) => {
        if (providerId === 'google' && data?.accessToken) {
            // useGoogleAuth hook will handle navigation automatically
            await handleGoogleLogin(data.accessToken);
        } else {
            // Use existing social sign up logic for other providers
            handleSocialSignUp(providerId);
        }
    };

    return (
        <div className={styles.signUpPage}>
            <div className={styles.backgroundDecoration}>
                <div className={styles.floatingDot}></div>
                <div className={styles.floatingDot}></div>
                <div className={styles.floatingDot}></div>
                <div className={styles.floatingDot}></div>
            </div>
            
            <div className={styles.signUpContainer}>
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Create Account</h2>

                    {/* Display general errors */}
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    {/* Display field-specific errors */}
                    {Object.keys(errors).length > 0 && !errors.general && (
                        <div className={styles.errorMessage}>
                            Please fix the following errors:
                            <ul className={styles.errorList}>
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                
                    <SignUpForm
                        formData={formData}
                        loading={loading}
                        onFormDataChange={handleFormDataChange}
                        onSubmit={handleSignUp}
                        onSocialLogin={handleSocialLogin}
                    />
                
                    <div className={styles.loginLink}>
                        <p>
                            Already have an account? {" "}
                            <button 
                                type="button"
                                className={styles.linkButton}
                                onClick={() => navigate('/login')}
                            >
                                Sign in now
                            </button>
                        </p>
                    </div>
                
                    <div className={styles.footerDecoration}>
                        <div className={styles.decorationDots}>
                            <div className={styles.decorationDot}></div>
                            <div className={styles.decorationDot}></div>
                            <div className={styles.decorationDot}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;