import axiosInstance from "../lib/axios";

export async function getCountries() {
  const response = await axiosInstance.get("/countries");
  return response.data;
}

export async function getProductTypes() {
  const response = await axiosInstance.get("/product-types");
  return response.data;
}

export async function getSkinTypes() {
  const response = await axiosInstance.get("/skin-types");
  return response.data;
}

export async function getConcerns() {
  const response = await axiosInstance.get("/concerns");
  return response.data;
}
