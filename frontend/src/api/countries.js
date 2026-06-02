import API from "../lib/axios";

export const getCountries = async () => {
  const response = await API.get("/countries");
  return response.data;
};

export const createCountry = async (data) => {
  const response = await API.post("/admin/countries", data);
  return response.data;
};

export const updateCountry = async (id, data) => {
  const response = await API.put(`/admin/countries/${id}`, data);
  return response.data;
};

export const deleteCountry = async (id) => {
  const response = await API.delete(`/admin/countries/${id}`);
  return response.data;
};
