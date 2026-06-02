import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const adminData = localStorage.getItem("admin");

  // Jika tidak ada token atau bukan admin, tendang kembali ke halaman login
  if (!token || !adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}