import api from "./axios";

export const getBookings = () =>
  api.get("/inventory/bookings");

export const getBooking = (
  id: string
) =>
  api.get(`/inventory/bookings/${id}`);

export const getBookingByInventory = (
  inventoryId: string
) =>
  api.get(
    `/inventory/bookings/by-inventory/${inventoryId}`
  );

export const receivePayment = (
  formData: FormData
) =>
  api.post(
    "/inventory/payments",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

export const cancelBooking = (
  id: string
) =>
  api.patch(
    `/inventory/bookings/${id}/cancel`
  );

export const updateBooking = (
  id: string,
  data: Record<string, unknown>
) =>
  api.put(
    `/inventory/bookings/${id}`,
    data
  );

export const deletePayment = (
  id: string
) =>
  api.delete(
    `/inventory/payments/${id}`
  );

export const uploadBookingDocument = (
  bookingId: string,
  formData: FormData
) =>
  api.post(
    `/inventory/bookings/${bookingId}/documents`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

export const deleteBookingDocument = (
  bookingId: string,
  documentId: string
) =>
  api.delete(
    `/inventory/bookings/${bookingId}/documents/${documentId}`
  );
