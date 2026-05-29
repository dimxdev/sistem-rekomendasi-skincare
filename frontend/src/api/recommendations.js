import axiosInstance from "../lib/axios";

export async function getRecommendations(payload) {
  const response = await axiosInstance.post("/recommendations", payload);
  return response.data;
}
