import axiosInstance from "../lib/axios";

export async function getProducts(params) {
  const response = await axiosInstance.get("/products", { params });
  return response.data;
}

export async function createProduct(payload) {
  const response = await axiosInstance.post("/products/admin", payload);
  return response.data;
}

export async function updateProduct(id, payload) {
  const response = await axiosInstance.put(`/products/admin/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await axiosInstance.delete(`/products/admin/${id}`);
  return response.data;
}
