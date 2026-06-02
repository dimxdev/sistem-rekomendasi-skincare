import axiosInstance from "../lib/axios";

// Mengambil semua user
export async function getAllUsers() {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
}

// Update data user
export async function updateUser(id, data) {
  const response = await axiosInstance.put(`/admin/users/${id}`, data);
  return response.data;
}

// Hapus user
export async function deleteUser(id) {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
}
