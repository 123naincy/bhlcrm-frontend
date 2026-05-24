import { useState } from "react";
import { createLead } from "../../api/leadApi";
import toast from "react-hot-toast";

export function CreateLeadModal({
  open,
  onClose,
  onSuccess,
}: any) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    source: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createLead(form);

      toast.success("Lead created successfully");

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-4 w-full max-w-xl shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Create New Lead
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl bg-slate-100"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl bg-slate-100"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl bg-slate-100"
          />

          <input
            placeholder="Source"
            value={form.source}
            onChange={(e) =>
              setForm({
                ...form,
                source: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl bg-slate-100"
          />

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
            className="w-full p-4 rounded-2xl bg-slate-100"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl font-semibold"
          >
            {loading ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}