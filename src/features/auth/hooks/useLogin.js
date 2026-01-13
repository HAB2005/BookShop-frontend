import { useState } from "react";
import { emailLoginService } from "../services/authService";
import { useToastContext } from "../../../app/providers";

export const useLogin = (navigate) => {
    const [loading, setLoading] = useState(false);
    const toast = useToastContext();

    const login = async (credentials) => {
        setLoading(true);

        try {
            const result = await emailLoginService(credentials);
      
            // Redirect based on role
            if (result.role === 'admin') {
                navigate("/dashboard");
            } else {
                navigate("/products"); 
            }
            
            return true; 
        } catch (err) {
            toast.error(err.message || 'Login failed. Please try again.');
            return false; // Failure
        } finally {
            setLoading(false);
        }
    };

    return { login, loading };
};
