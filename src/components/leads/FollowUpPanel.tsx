import { useEffect, useState } from "react";
import {
  Phone,
  MessageCircle,
  Trash2,
  Building2,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  createFollowUp,
  getLeadFollowUps,
  deleteFollowUp,
} from "../../api/followUpApi";

interface Props {
  leadId: string;
}

export default function FollowUpPanel({
  leadId,
}: Props) {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    noteType: "call",
    note: "",
    nextFollowUp: "",
  });

  useEffect(() => {
    loadFollowUps();
  }, [leadId]);

  const loadFollowUps = async () => {
    try {
      const res = await getLeadFollowUps(leadId);
      setFollowUps(res.followUps || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!form.note) {
      toast.error("Note required");
      return;
    }

    try {
      setLoading(true);

      await createFollowUp({
        leadId,
        ...form,
      });

      toast.success("Follow-up added");

      setForm({
        noteType: "call",
        note: "",
        nextFollowUp: "",
      });

      loadFollowUps();
    } catch (error) {
      console.error(error);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete follow-up?"))
      return;

    try {
      await deleteFollowUp(id);
      toast.success("Deleted");
      loadFollowUps();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone size={18} />;
      case "whatsapp":
        return <MessageCircle size={18} />;
      case "meeting":
        return <Building2 size={18} />;
      case "email":
        return <Mail size={18} />;
      default:
        return <Phone size={18} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 space-y-8">
      <h2 className="text-2xl font-bold">
        Follow-up Management
      </h2>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={form.noteType}
          onChange={(e) =>
            setForm({
              ...form,
              noteType: e.target.value,
            })
          }
          className="p-4 rounded-2xl border"
        >
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="site_visit">
            Site Visit
          </option>
          <option value="whatsapp">
            WhatsApp
          </option>
          <option value="email">Email</option>
        </select>

        <input
          type="datetime-local"
          value={form.nextFollowUp}
          onChange={(e) =>
            setForm({
              ...form,
              nextFollowUp: e.target.value,
            })
          }
          className="p-4 rounded-2xl border"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl font-semibold"
        >
          Add Follow-up
        </button>
      </div>

      <textarea
        placeholder="Enter note..."
        value={form.note}
        onChange={(e) =>
          setForm({
            ...form,
            note: e.target.value,
          })
        }
        className="w-full p-4 rounded-2xl border h-28"
      />

      {/* TIMELINE */}
      <div className="space-y-4">
        {followUps.map((item) => (
          <div
            key={item._id}
            className="border rounded-2xl p-5 flex justify-between items-start"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                {getIcon(item.noteType)}
              </div>

              <div>
                <h3 className="font-bold capitalize">
                  {item.noteType.replace("_", " ")}
                </h3>

                <p className="text-slate-600 mt-2">
                  {item.note}
                </p>

                {item.nextFollowUp && (
                  <p className="text-sm text-slate-400 mt-2">
                    Next:{" "}
                    {new Date(
                      item.nextFollowUp
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() =>
                handleDelete(item._id)
              }
              className="text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}