import { emailLoginApi, logoutApi, emailRegisterApi } from "../api/auth.api.js";

// ==================== NEW EMAIL-BASED LOGIN SERVICE ====================
export const emailLoginService = async (credentials) => {
    try {
        const res = await emailLoginApi(credentials);

        if (!res.data?.token) {
            throw new Error("Invalid token received");
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
            userId: res.data.userId,
            username: res.data.username,
            fullName: res.data.fullName,
            role: res.data.role
        }));
        return res.data;
    } catch (error) {
        // Xử lý các loại error khác nhau
        if (error.response) {
            const { status, data } = error.response;

            // Lỗi từ server (4xx, 5xx)
            if (status === 401) {
                // Check for specific error codes
                if (data?.errorCode === "ACCOUNT_DISABLED") {
                    throw new Error(data?.message || "Your account has been disabled. Please contact administrator.");
                } else if (data?.errorCode === "ACCOUNT_EXISTS_OTHER_PROVIDER") {
                    throw new Error(data?.message || "This account was created with Google/Phone. Would you like to set a password for email login?");
                } else {
                    // Lỗi authentication - sai email/password
                    throw new Error(data?.message || "Invalid email or password");
                }
            } else if (status === 400) {
                // Lỗi validation - xử lý chi tiết
                if (data?.validationErrors && data.validationErrors.length > 0) {
                    // Tạo message từ validation errors
                    const validationMessages = data.validationErrors.map(err => {
                        if (err.field === 'email') {
                            return `Email: ${err.message}`;
                        } else if (err.field === 'password') {
                            return `Password: ${err.message}`;
                        }
                        return `${err.field}: ${err.message}`;
                    });
                    throw new Error(validationMessages.join('. '));
                } else {
                    // Fallback cho validation error không có chi tiết
                    throw new Error(data?.message || "Please check your input fields");
                }
            } else if (status >= 500) {
                // Lỗi server
                throw new Error("Server error. Please try again later");
            } else {
                // Lỗi khác
                throw new Error(data?.message || "Login failed");
            }
        } else if (error.request) {
            // Lỗi network - không kết nối được server
            throw new Error("Unable to connect to server. Please check your internet connection");
        } else {
            // Lỗi khác
            throw new Error(error.message || "An unexpected error occurred");
        }
    }
};

export const registerService = async (userData) => {
    try {
        const res = await emailRegisterApi(userData);

        if (!res.data?.token) {
            throw new Error("Registration failed - invalid response");
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
            userId: res.data.userId,
            username: res.data.username,
            fullName: res.data.fullName,
            role: res.data.role
        }));
        return res.data;
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 400) {
                if (data?.validationErrors && data.validationErrors.length > 0) {
                    const validationMessages = data.validationErrors.map(err =>
                        `${err.field}: ${err.message}`
                    );
                    throw new Error(validationMessages.join('. '));
                } else {
                    throw new Error(data?.message || "Registration failed - please check your input");
                }
            } else if (status === 409) {
                throw new Error("Email already exists");
            } else if (status >= 500) {
                throw new Error("Server error. Please try again later");
            } else {
                throw new Error(data?.message || "Registration failed");
            }
        } else if (error.request) {
            throw new Error("Unable to connect to server. Please check your internet connection");
        } else {
            throw new Error(error.message || "An unexpected error occurred");
        }
    }
};

export const logoutService = async () => {
    try {
        await logoutApi();
    } catch (e) {
        console.warn("Logout API failed, force logout");
    } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};