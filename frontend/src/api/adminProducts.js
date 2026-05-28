import axiosInstance from "../lib/axios";

export async function createAdminProduct(payload) {
  const response = await axiosInstance.post("/admin/products", payload);
  return response.data;
}

export async function deleteAdminProduct(productId) {
  const response = await axiosInstance.delete(`/admin/products/${productId}`);
  return response.data;
}
