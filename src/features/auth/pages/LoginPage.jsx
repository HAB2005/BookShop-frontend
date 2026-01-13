import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin.js";
import { useGoogleAuth } from "../hooks/useGoogleAuth.js";
import { Button } from "../../../shared/ui/button.jsx";
import SocialLoginSection from "../components/SocialLoginSection.jsx";
import styles from './LoginPage.module.css';

function LoginPage() {
    const navigate = useNavigate();
    const { login, loading } = useLogin(navigate);
    const { handleGoogleLogin, loading: googleLoading, error: googleError } = useGoogleAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            return;
        }

        await login({
            email: formData.email,
            password: formData.password
        });
    };

    const handleSocialLogin = async (providerId, data) => {
        if (providerId === 'google' && data?.accessToken) {
            // useGoogleAuth hook will handle navigation automatically
            await handleGoogleLogin(data.accessToken);
        } else {
            // TODO: Implement other social login providers
            console.log(`${providerId} login not implemented yet`);
        }
    };

    const handleForgotPassword = () => {
        console.log('Navigate to forgot password');
        // TODO: Navigate to forgot password page
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.backgroundDecoration}>
                <div className={styles.floatingDot}></div>
                <div className={styles.floatingDot}></div>
                <div className={styles.floatingDot}></div>
                <div className={styles.floatingDot}></div>
            </div>
            
            <div className={styles.loginContainer}>
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Login</h2>
                    <p className={styles.formSubtitle}>
                        Choose your preferred sign-in method
                    </p>
                
                    <div className={styles.loginFormContainer}>
                        {/* Left Column - Social Login */}
                        <div className={styles.leftColumn}>
                            <SocialLoginSection onSocialLogin={handleSocialLogin} />
                            
                            {/* Display Google login error if any */}
                            {googleError && (
                                <div className={styles.errorMessage}>
                                    {googleError}
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>or</span>
                            <span className={styles.dividerLine}></span>
                        </div>

                        {/* Right Column - Email/Password Form */}
                        <div className={styles.rightColumn}>
                            <form onSubmit={handleSubmit} className={styles.loginForm}>
                                {/* Input fields group - match với main social buttons */}
                                <div className={styles.formInputsGroup}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="Enter your email"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="Enter your password"
                                            required
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>

                                {/* Options group - match với secondary social buttons */}
                                <div className={styles.formOptionsGroup}>
                                    <div className={styles.formOptions}>
                                        <label className={styles.checkboxLabel}>
                                            <input type="checkbox" className={styles.checkbox} />
                                            <span className={styles.checkboxText}>Remember me</span>
                                        </label>
                                        <button 
                                            type="button"
                                            className={styles.forgotPassword}
                                            onClick={handleForgotPassword}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>

                                {/* Submit group */}
                                <div className={styles.formSubmitGroup}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="large"
                                        loading={loading}
                                        disabled={loading || !formData.email || !formData.password}
                                        className={styles.submitButton}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                
                    <div className={styles.signupLink}>
                        <p>
                            Don't have an account? {" "}
                            <button 
                                type="button"
                                className={styles.linkButton}
                                onClick={() => navigate('/login/signup')}
                            >
                                Sign up now
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

export default LoginPage;
