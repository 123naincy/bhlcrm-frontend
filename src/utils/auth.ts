import { useAuthStore } from "../store/authStore";

export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};

export const getToken = () => {
  return useAuthStore.getState().token;
};

export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};

export const hasRole = (roles: string[]) => {
  const user = getCurrentUser();

  if (!user) return false;

  return roles.includes(user.role);
};
