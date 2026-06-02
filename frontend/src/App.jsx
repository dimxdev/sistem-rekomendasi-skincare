import { Route, Routes } from "react-router-dom";

// === IMPORT HALAMAN PENGGUNA (PUBLIC & USER) ===
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import RecommendationPage from "./pages/RecommendationPage";
import NotFoundPage from "./pages/NotFoundPage";

// === IMPORT HALAMAN ADMIN UTAMA ===
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminUsers from "./pages/admin/AdminUsers";

// === IMPORT HALAMAN MASTER DATA ADMIN ===
import AdminCountries from "./pages/admin/AdminCountries";
import AdminMasterDataPage from "./pages/admin/AdminMasterDataPage";

// === IMPORT API UNTUK KOMPONEN MASTER DATA DINAMIS ===
import {
  getProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
  getSkinTypes,
  createSkinType,
  updateSkinType,
  deleteSkinType,
  getConcerns,
  createConcern,
  updateConcern,
  deleteConcern,
} from "./api/masterDataAdmin";

function App() {
  return (
    <div className="">
      <Routes>
        {/* ============================== */}
        {/* PUBLIC & USER ROUTES           */}
        {/* ============================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />

        {/* ============================== */}
        {/* ADMIN ROUTES                   */}
        {/* ============================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/addproduct" element={<AdminAddProduct />} />
        <Route
          path="/admin/products/:productId/edit"
          element={<AdminEditProduct />}
        />

        {/* --- Master Data Routes --- */}
        <Route path="/admin/countries" element={<AdminCountries />} />

        <Route
          path="/admin/product-types"
          element={
            <AdminMasterDataPage
              title="Product Types"
              subtitle="registered product categories"
              activePage="product-types"
              placeholder="e.g. Serum, Toner"
              apiGet={getProductTypes}
              apiCreate={createProductType}
              apiUpdate={updateProductType}
              apiDelete={deleteProductType}
            />
          }
        />

        <Route
          path="/admin/skin-types"
          element={
            <AdminMasterDataPage
              title="Skin Types"
              subtitle="registered skin types"
              activePage="skin-types"
              placeholder="e.g. Oily, Dry"
              apiGet={getSkinTypes}
              apiCreate={createSkinType}
              apiUpdate={updateSkinType}
              apiDelete={deleteSkinType}
            />
          }
        />

        <Route
          path="/admin/concerns"
          element={
            <AdminMasterDataPage
              title="Skin Concerns"
              subtitle="registered skin concerns"
              activePage="concerns"
              placeholder="e.g. Acne, Dark Spot"
              apiGet={getConcerns}
              apiCreate={createConcern}
              apiUpdate={updateConcern}
              apiDelete={deleteConcern}
            />
          }
        />

        {/* ============================== */}
        {/* NOT FOUND ROUTE (404)          */}
        {/* ============================== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
