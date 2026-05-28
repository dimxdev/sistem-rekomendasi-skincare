import axiosInstance from "../lib/axios";

export async function createAdminProduct(payload) {
  const response = await axiosInstance.post("/admin/products", payload);
  return response.data;
}

export async function deleteAdminProduct(productId) {
  const response = await axiosInstance.delete(`/admin/products/${productId}`);
  return response.data;
}

export async function updateAdminProduct(productId, payload) {
  const response = await axiosInstance.put(
    `/admin/products/${productId}`,
    payload,
  );
  return response.data;
}

export async function toggleAdminProductStatus(productId, isActive) {
  const response = await axiosInstance.patch(
    `/admin/products/${productId}/status`,
    { isActive },
  );
  return response.data;
}
