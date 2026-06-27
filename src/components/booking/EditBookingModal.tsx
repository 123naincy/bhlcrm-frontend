import { useState } from "react";
import { X } from "lucide-react";

import { updateBooking } from "../../api/bookingApi";
import type { Booking } from "../../types/booking";

interface Props {
  open: boolean;
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookingModal({
  open,
  booking,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    salesExecutive:
      booking.salesExecutive || "",

    channelPartner:
      booking.channelPartner || "",

    salesExecutiveCommission: String(
      booking.salesExecutiveCommission ||
        0
    ),

    channelPartnerCommission: String(
      booking.channelPartnerCommission ||
        0
    ),

    remarks:
      (booking as any).remarks || "",
  });

  if (!open) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateBooking(
        booking._id,
        {
          salesExecutive:
            form.salesExecutive,

          channelPartner:
            form.channelPartner,

          salesExecutiveCommission:
            Number(
              form.salesExecutiveCommission
            ) || 0,

          channelPartnerCommission:
            Number(
              form.channelPartnerCommission
            ) || 0,

          remarks: form.remarks,
        }
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      window.alert(
        err?.response?.data?.message ||
          "Failed to update booking"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" />

      <div className="fixed inset-0 z-50 flex justify-center items-center p-5">
        <div className="bg-white rounded-xl w-full max-w-lg">
          <div className="border-b p-5 flex justify-between">
            <h2 className="text-xl font-bold">
              Edit Booking
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <Field
              label="Sales Executive"
              name="salesExecutive"
              value={
                form.salesExecutive
              }
              onChange={handleChange}
            />

            <Field
              label="Channel Partner"
              name="channelPartner"
              value={
                form.channelPartner
              }
              onChange={handleChange}
            />

            <Field
              label="SE Commission"
              name="salesExecutiveCommission"
              type="number"
              value={
                form.salesExecutiveCommission
              }
              onChange={handleChange}
            />

            <Field
              label="CP Commission"
              name="channelPartnerCommission"
              type="number"
              value={
                form.channelPartnerCommission
              }
              onChange={handleChange}
            />

            <div>
              <label className="text-sm text-gray-600">
                Remarks
              </label>

              <textarea
                name="remarks"
                rows={3}
                value={form.remarks}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>
          </div>

          <div className="border-t p-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="border px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-3 mt-1"
      />
    </div>
  );
}
