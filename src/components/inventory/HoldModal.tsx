import { useState } from "react";
import { X } from "lucide-react";
import { markHold } from "../../api/inventoryApi";

interface HoldModalProps {
  open: boolean;
  inventoryId: string;
  plotNo: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function HoldModal({
  open,
  inventoryId,
  plotNo,
  onClose,
  onSuccess,
}: HoldModalProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    tokenAmount: "",
    holdDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    remarks: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.customerName) {
      alert("Customer Name is required");
      return;
    }

    if (!formData.mobile) {
      alert("Mobile Number is required");
      return;
    }

    if (!formData.expiryDate) {
      alert("Expiry Date is required");
      return;
    }

    try {
      setLoading(true);

      await markHold({
        inventoryId,
        customerName: formData.customerName,
        mobile: formData.mobile,
        tokenAmount: Number(formData.tokenAmount),
        holdDate: formData.holdDate,
        expiryDate: formData.expiryDate,
        remarks: formData.remarks,
      });

      alert("Plot marked as Hold successfully.");

      onSuccess();

      onClose();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Unable to create hold."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}

      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="fixed left-1/2 top-1/2 w-[550px] max-w-[95%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">

          <div>

            <h2 className="text-xl font-bold">
              Hold Plot
            </h2>

            <p className="text-sm text-gray-500">
              Plot No : {plotNo}
            </p>

          </div>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-5 space-y-4">

          <div>

            <label className="block mb-1 font-medium">
              Customer Name
            </label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-1 font-medium">
              Mobile Number
            </label>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="block mb-1 font-medium">
                Token Amount
              </label>

              <input
                type="number"
                name="tokenAmount"
                value={formData.tokenAmount}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="block mb-1 font-medium">
                Hold Date
              </label>

              <input
                type="date"
                name="holdDate"
                value={formData.holdDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

          <div>

            <label className="block mb-1 font-medium">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-1 font-medium">
              Remarks
            </label>

            <textarea
              rows={4}
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 resize-none"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-5">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Mark Hold"}
          </button>

        </div>

      </div>
    </>
  );
}