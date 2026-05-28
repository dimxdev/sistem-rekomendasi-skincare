import axiosInstance from "../lib/axios";

export async function getProducts(params) {
  const response = await axiosInstance.get("/products", { params });
  return response.data;
}

export async function getProductDetail(productId, params) {
  const response = await axiosInstance.get(`/products/${productId}`, {
    params,
  });
  return response.data;
}
