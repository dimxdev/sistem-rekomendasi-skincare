import API from "../lib/axios";

export const getAllUsers = async () => (await API.get("/admin/users")).data;
export const getUserById = async (id) =>
  (await API.get(`/admin/users/${id}`)).data;
export const updateUser = async (id, data) =>
  (await API.put(`/admin/users/${id}`, data)).data;
export const deleteUser = async (id) =>
  (await API.delete(`/admin/users/${id}`)).data;
