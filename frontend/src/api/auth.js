import axiosInstance from "../lib/axios";

export async function loginUser(payload) {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
}

export async function loginAdmin(payload) {
  const response = await axiosInstance.post("/admin/login", payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await axiosInstance.post("/auth/register", payload);
  return response.data;
}

export async function getMe() {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
}

export async function updateMe(payload) {
  const response = await axiosInstance.put("/users/me", payload);
  return response.data;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
