import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import { UserPage } from "../../features/user";
import { ProfilePage } from "../../features/profile";
import UnauthorizedPage from "../../pages/error/UnauthorizedPage";
import NotFoundPage from "../../pages/error/NotFoundPage";
import { DashboardPage } from "../../features/dashboard";
import { OrdersPage } from "../../features/order";
import { CartPage } from "../../features/cart";
import { FavoritesPage } from "../../features/favorites";
import ProtectedLayout from "../../shared/layout/ProtectedLayout";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../../shared/components/ErrorBoundary";

// Import consolidated product pages
import CustomerProductListPage from "../../features/product/pages/CustomerProductListPage.jsx";
import AdminProductListPage from "../../features/product/pages/AdminProductListPage.jsx";
import ProductDetailPage from "../../features/product/pages/ProductDetailPage.jsx";
import AddProductPage from "../../features/product/pages/AddProductPage.jsx";
import EditProductPage from "../../features/product/pages/EditProductPage.jsx";

// Import remaining pages from products feature (to be migrated)
import UpdateProductPage from "../../features/products/pages/UpdateProductPage.jsx";
import EditProductListPage from "../../features/products/pages/EditProductListPage.jsx";

// Import CategoryManagementPage
import { CategoryManagementPage } from "../../features/category";

export default function AppRoutes() {
  return (
    <ErrorBoundary message="Routing error occurred. Please try refreshing the page.">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/login/*" element={<AuthRoutes />} />

        {/* Error pages - without layout */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Protected routes with shared layout */}
        <Route path="/products" element={
          <ProtectedRoute allowedRoles={['admin', 'customer']}>
            <ProtectedLayout>
              <CustomerProductListPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Product Detail Page */}
        <Route path="/products/:productId" element={
          <ProtectedRoute allowedRoles={['admin', 'customer']}>
            <ProtectedLayout>
              <ProductDetailPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin product list management */}
        <Route path="/products/manage" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <AdminProductListPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin edit products page - shows all products regardless of status */}
        <Route path="/products/edit-list" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <EditProductListPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin-only product management routes */}
        <Route path="/products/add" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <AddProductPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/products/edit" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <EditProductPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/products/edit/:productId" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <EditProductPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* New update product route */}
        <Route path="/products/update/:productId" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <UpdateProductPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Fallback route for update without productId */}
        <Route path="/products/update" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <AdminProductListPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin-only category management route */}
        <Route path="/categories" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <CategoryManagementPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['admin', 'customer']}>
            <ProtectedLayout>
              <OrdersPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute requiredRole="customer">
            <ProtectedLayout>
              <CartPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/favorites" element={
          <ProtectedRoute requiredRole="customer">
            <ProtectedLayout>
              <FavoritesPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['admin', 'customer']}>
            <ProtectedLayout>
              <ProfilePage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Admin-only routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <UserPage />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="admin">
            <ProtectedLayout>
              <AdminRoutes />
            </ProtectedLayout>
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
