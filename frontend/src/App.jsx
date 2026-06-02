import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminMasterData from "./pages/admin/AdminMasterData";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProtectedRoute from "./AdminProtectedRoute";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfilePage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/master-data"
          element={
            <AdminProtectedRoute>
              <AdminMasterData />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/addproduct"
          element={
            <AdminProtectedRoute>
              <AdminAddProduct />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
