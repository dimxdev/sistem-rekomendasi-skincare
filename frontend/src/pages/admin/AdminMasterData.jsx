import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import MasterDataTable from "../../components/admin/MasterDataTable";
import * as masterDataApi from "../../api/masterData"; // Pastikan path ini benar

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState("countries");

  // Konfigurasi Tabs
  const tabs = [
    { id: "countries", label: "Countries" },
    { id: "productTypes", label: "Product Types" },
    { id: "skinTypes", label: "Skin Types" },
    { id: "skinConcerns", label: "Skin Concerns" },
  ];

  return (
    <div
      className="admin min-h-screen"
      style={{ backgroundColor: "var(--color-admin-background)" }}
    >
      <AdminSidebar activePage="master-data" />

      <main
        className="min-h-screen"
        style={{ marginLeft: "var(--admin-sidebar-width)", padding: "40px" }}
      >
        <div className="mb-8">
          <p
            className="font-admin-label mb-1"
            style={{ color: "var(--color-admin-primary)" }}
          >
            DATABASE MANAGEMENT
          </p>
          <h1 className="font-admin-display-lg text-gray-900">Master Data</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-6 border-b mb-6 border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="pb-3 px-2 font-admin-label tracking-widest text-[11px] transition-colors relative"
              style={{
                color: activeTab === tab.id ? "black" : "gray",
                fontWeight: activeTab === tab.id ? "600" : "400",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents - SEKARANG MENGGUNAKAN MASTERDATATABLE */}
        <div className="pt-2">
          {activeTab === "countries" && (
            <MasterDataTable
              title="Negara (Country)"
              dataKey="namaNegara"
              fetchApi={masterDataApi.getCountries}
              addApi={masterDataApi.addCountry}
              updateApi={masterDataApi.updateCountry}
              deleteApi={masterDataApi.deleteCountry}
              columns={[
                { label: "NAMA NEGARA" },
                { label: "KODE" },
                { label: "AKSI" },
              ]}
            />
          )}

          {activeTab === "productTypes" && (
            <MasterDataTable
              title="Tipe Produk"
              fetchApi={masterDataApi.getProductTypes}
              addApi={masterDataApi.addProductType}
              updateApi={masterDataApi.updateProductType}
              deleteApi={masterDataApi.deleteProductType}
              columns={[{ label: "NAMA TIPE PRODUK" }, { label: "AKSI" }]}
            />
          )}

          {activeTab === "skinTypes" && (
            <MasterDataTable
              title="Tipe Kulit"
              fetchApi={masterDataApi.getSkinTypes}
              addApi={masterDataApi.addSkinType}
              updateApi={masterDataApi.updateSkinType}
              deleteApi={masterDataApi.deleteSkinType}
              columns={[{ label: "NAMA TIPE KULIT" }, { label: "AKSI" }]}
            />
          )}

          {activeTab === "skinConcerns" && (
            <MasterDataTable
              title="Masalah Kulit (Concern)"
              fetchApi={masterDataApi.getConcerns}
              addApi={masterDataApi.addConcern}
              updateApi={masterDataApi.updateConcern}
              deleteApi={masterDataApi.deleteConcern}
              columns={[{ label: "NAMA MASALAH KULIT" }, { label: "AKSI" }]}
            />
          )}
        </div>
      </main>
    </div>
  );
}
