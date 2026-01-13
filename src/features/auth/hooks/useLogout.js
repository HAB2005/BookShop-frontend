import { useNavigate } from "react-router-dom";
import { logoutService } from "../services/authService";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutService();
    navigate("/login");
  };

  return logout;
};
