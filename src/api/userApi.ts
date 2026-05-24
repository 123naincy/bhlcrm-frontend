import api from "./axios";

/**
 * GET ALL USERS
 */
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

/**
 * GET SINGLE USER
 */
export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * CREATE USER
 */
export const createUser = async (data: any) => {
  const response = await api.post("/users", data);
  return response.data;
};

/**
 * UPDATE USER
 */
export const updateUser = async (
  id: string,
  data: any
) => {
  const response = await api.put(
    `/users/${id}`,
    data
  );
  return response.data;
};

/**
 * TOGGLE USER STATUS
 */
export const toggleUserStatus = async (
  id: string
) => {
  const response = await api.patch(
    `/users/status/${id}`
  );
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};