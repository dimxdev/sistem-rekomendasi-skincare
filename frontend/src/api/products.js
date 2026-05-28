import axiosInstance from "../lib/axios";

export async function getProducts(params) {
  const response = await axiosInstance.get("/products", { params });
  return response.data;
}
