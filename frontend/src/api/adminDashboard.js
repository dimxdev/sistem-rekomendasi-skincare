import axiosInstance from "../lib/axios";

export async function getAdminDashboardSummary() {
  const response = await axiosInstance.get("/admin/dashboard");

  return response.data;
}
