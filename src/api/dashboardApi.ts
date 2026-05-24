import api from "./axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getTeamPerformance = async () => {
  const response = await api.get("/dashboard/team-performance");
  return response.data;
};

export const getSourcePerformance = async () => {
  const response = await api.get("/dashboard/source-performance");
  return response.data;
};