import API from "../lib/axios";

// Product Types
export const getProductTypes = async () =>
  (await API.get("/product-types")).data;
export const createProductType = async (data) =>
  (await API.post("/admin/product-types", data)).data;
export const updateProductType = async (id, data) =>
  (await API.put(`/admin/product-types/${id}`, data)).data;
export const deleteProductType = async (id) =>
  (await API.delete(`/admin/product-types/${id}`)).data;

// Skin Types
export const getSkinTypes = async () => (await API.get("/skin-types")).data;
export const createSkinType = async (data) =>
  (await API.post("/admin/skin-types", data)).data;
export const updateSkinType = async (id, data) =>
  (await API.put(`/admin/skin-types/${id}`, data)).data;
export const deleteSkinType = async (id) =>
  (await API.delete(`/admin/skin-types/${id}`)).data;

// Skin Concerns
export const getConcerns = async () => (await API.get("/concerns")).data;
export const createConcern = async (data) =>
  (await API.post("/admin/concerns", data)).data;
export const updateConcern = async (id, data) =>
  (await API.put(`/admin/concerns/${id}`, data)).data;
export const deleteConcern = async (id) =>
  (await API.delete(`/admin/concerns/${id}`)).data;
