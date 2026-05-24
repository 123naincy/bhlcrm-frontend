import api from "./axios";

export const getTeamUsers = async () => {
  const response = await api.get("/employees");

  return {
    users: response.data.employees || [],
  };
};
