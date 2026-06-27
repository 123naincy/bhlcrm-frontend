import api from "./axios";

export const getDashboard = () =>
  api.get("/inventory/dashboard");

export const getInventory = (
  id: string
) =>
  api.get(`/inventory/${id}`);

export const markHold = (
  data: any
) =>
  api.post(
    "/inventory/holds",
    data
  );

export const releaseHold = (
  id: string
) =>
  api.patch(
    `/inventory/holds/${id}/release`
  );

export const createBooking = (
  data: any
) =>
  api.post(
    "/inventory/bookings",
    data
  );