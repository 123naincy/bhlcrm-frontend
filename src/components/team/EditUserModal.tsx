import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { updateUser } from "../../api/userApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export default function EditUserModal({
  open,
  onClose,
  onSuccess,
  user,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    role: "",
    city: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        role: user.role || "",
        city: user.city || "",
      });
    }
  }, [user]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await updateUser(user._id, form);

      toast.success("User updated successfully");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Edit Team Member
            </h2>
            <p className="text-slate-500 mt-2">
              Update user information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="p-4 rounded-2xl border border-slate-200"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="p-4 rounded-2xl border border-slate-200"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="p-4 rounded-2xl border border-slate-200"
          >
            <option value="admin">Admin</option>
            <option value="sales_manager">Sales Manager</option>
            <option value="sales_executive">Sales Executive</option>
          </select>

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="p-4 rounded-2xl border border-slate-200"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-green-700 text-white py-4 rounded-2xl font-semibold text-lg hover:scale-[1.02] transition"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </div>
    </div>
  );
}