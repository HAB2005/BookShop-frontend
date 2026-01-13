import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

export const useSignUp = () => {
  const navigate = useNavigate();
  const { emailRegister } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const signUpData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const result = await emailRegister(signUpData);

      if (result) {
        // Tự động đăng nhập thành công, chuyển hướng dựa trên role
        if (result.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/products');
        }

        return { success: true };
      } else {
        throw new Error('Registration failed - no result returned');
      }
    } catch (error) {
      console.error('Sign up error:', error);

      let errorMessage = 'Failed to create account. Please try again.';

      if (error.message) {
        if (error.message.includes('email')) {
          errorMessage = 'This email is already registered. Please use a different email or try signing in.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    setLoading(true);

    try {
      // TODO: Implement social sign up logic
    } catch (error) {
      console.error('Social sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    });
    setErrors({});
  };

  return {
    formData,
    setFormData,
    loading,
    errors,
    handleSignUp,
    handleSocialSignUp,
    clearErrors,
    resetForm,
    validateForm
  };
};