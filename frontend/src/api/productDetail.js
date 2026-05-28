import axiosInstance from "../lib/axios";

export async function getProductDetail(productId) {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
}
