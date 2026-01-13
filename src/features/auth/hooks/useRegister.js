import { useState } from "react";
import { registerService } from "../services/authService";

export const useRegister = (navigate) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const register = async (userData) => {
        setLoading(true);
        setError("");

        try {
            await registerService(userData);
            navigate("/products");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
};