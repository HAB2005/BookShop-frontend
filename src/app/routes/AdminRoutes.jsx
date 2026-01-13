import { Routes, Route } from "react-router-dom";
import { UserPage } from "../../features/user";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="user-list" element={<UserPage />} />
      <Route path="users" element={<UserPage />} />
      {/* Add more admin routes here as needed */}
    </Routes>
  );
}