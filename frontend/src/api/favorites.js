import axiosInstance from "../lib/axios";

export async function addFavorite(productId) {
  const response = await axiosInstance.post("/favorites", { productId });
  return response.data;
}

export async function removeFavorite(productId) {
  const response = await axiosInstance.delete(`/favorites/${productId}`);
  return response.data;
}

export async function getFavorites() {
  const response = await axiosInstance.get("/favorites");
  return response.data;
}
