import { Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage } from "../../features/auth";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="" element={<LoginPage />} />
      <Route path="signup" element={<SignUpPage />} />
    </Routes>
  );
}