import axiosInstance from "../lib/axios";

export async function getCountries() {
  const response = await axiosInstance.get("/countries");
  return response.data;
}

export async function addCountry(data) {
  const response = await axiosInstance.post("/admin/countries", data);
  return response.data;
}

export async function updateCountry(id, data) {
  const response = await axiosInstance.put(`/admin/countries/${id}`, data);
  return response.data;
}

export async function deleteCountry(id) {
  const response = await axiosInstance.delete(`/admin/countries/${id}`);
  return response.data;
}

export async function getProductTypes() {
  const response = await axiosInstance.get("/product-types");
  return response.data;
}

export async function addProductType(data) {
  const response = await axiosInstance.post("/admin/product-types", data);
  return response.data;
}

export async function updateProductType(id, data) {
  const response = await axiosInstance.put(`/admin/product-types/${id}`, data);
  return response.data;
}

export async function deleteProductType(id) {
  const response = await axiosInstance.delete(`/admin/product-types/${id}`);
  return response.data;
}

export async function getSkinTypes() {
  const response = await axiosInstance.get("/skin-types");
  return response.data;
}

export async function addSkinType(data) {
  const response = await axiosInstance.post("/admin/skin-types", data);
  return response.data;
}

export async function updateSkinType(id, data) {
  const response = await axiosInstance.put(`/admin/skin-types/${id}`, data);
  return response.data;
}

export async function deleteSkinType(id) {
  const response = await axiosInstance.delete(`/admin/skin-types/${id}`);
  return response.data;
}

export async function getConcerns() {
  const response = await axiosInstance.get("/concerns");
  return response.data;
}

export async function addConcern(data) {
  const response = await axiosInstance.post("/admin/concerns", data);
  return response.data;
}

export async function updateConcern(id, data) {
  const response = await axiosInstance.put(`/admin/concerns/${id}`, data);
  return response.data;
}

export async function deleteConcern(id) {
  const response = await axiosInstance.delete(`/admin/concerns/${id}`);
  return response.data;
}
