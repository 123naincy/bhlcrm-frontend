import { useEffect, useState } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  IndianRupee,
  Building2,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getSingleLead,
  getLeadTimeline,
  updateLead,
} from "../../api/leadApi";

import { getLeadFollowUps } from "../../api/followUpApi";

import { UpdateLeadDrawer } from "./UpdateLeadDrawer";
import { ReassignLeadDrawer } from "./ReassignLeadDrawer";
import { getProjectLabel } from "../../utils/leadDisplay";
import {
  requiresScheduleDate,
} from "../../constants/scheduleStatuses";
import {
  toDatetimeLocalValue,
} from "../../utils/dateTimeLocal";

interface Props {
  open: boolean;
  leadId: string | null;
  onClose: () => void;
}

export default function LeadPreviewDrawer({
  open,
  leadId,
  onClose,
}: Props) {
  const [lead, setLead] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>(
    []
  );
  const [followUps, setFollowUps] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(false);

  const [updateOpen, setUpdateOpen] =
    useState(false);

  const [reassignOpen, setReassignOpen] =
    useState(false);

  const [temperature, setTemperature] =
    useState("");

  const [followUpDate, setFollowUpDate] =
    useState("");

  const [scheduledDate, setScheduledDate] =
    useState("");

  useEffect(() => {
    if (open && leadId) {
      loadLead();
    }
  }, [open, leadId]);

  const loadLead = async () => {
    try {
      setLoading(true);

      const [
        leadRes,
        timelineRes,
        followUpRes,
      ] = await Promise.all([
        getSingleLead(leadId || ""),
        getLeadTimeline(leadId || ""),
        getLeadFollowUps(leadId || ""),
      ]);

      setLead(leadRes.lead);

      setTemperature(
        leadRes.lead?.temperature || ""
      );

      setFollowUpDate(
        toDatetimeLocalValue(
          leadRes.lead?.followUpDate
        )
      );

      setScheduledDate(
        toDatetimeLocalValue(
          leadRes.lead?.scheduledDate
        )
      );

      setTimeline(
        timelineRes.activities || []
      );

      setFollowUps(
        followUpRes.followUps || []
      );
    } catch {
      toast.error(
        "Failed to load lead preview"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    status: string
  ) => {
    try {
      if (requiresScheduleDate(status)) {
        toast.error(
          "Please set schedule date below and save"
        );
        return;
      }

      await updateLead(leadId || "", {
        status,
      });

      toast.success(
        `Lead marked ${status}`
      );

      loadLead();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleQuickSave = async () => {
    try {
      await updateLead(leadId || "", {
        temperature,
        followUpDate,
        ...(scheduledDate
          ? { scheduledDate }
          : {}),
      });

      toast.success(
        "Lead updated successfully"
      );

      loadLead();
    } catch {
      toast.error("Update failed");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="relative w-full max-w-2xl h-screen bg-white shadow-2xl overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-20">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold">
                {lead?.fullName ||
                  "Loading..."}
              </h2>

              <div className="flex gap-4 mt-3 text-slate-500 flex-wrap">
                <span>
                  📞 {lead?.phone}
                </span>

                <span>
                  📍 {lead?.city}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead?.temperature ===
                    "hot"
                      ? "bg-red-100 text-red-700"
                      : lead?.temperature ===
                        "warm"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {lead?.temperature}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            Loading lead...
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* TOP QUICK ACTIONS */}
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() =>
                  window.open(
                    `tel:${lead?.phone}`
                  )
                }
                className="bg-green-100 text-green-700 p-4 rounded-xl"
              >
                <Phone className="mx-auto" />
              </button>

              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/91${lead?.phone}`,
                    "_blank"
                  )
                }
                className="bg-emerald-100 text-emerald-700 p-4 rounded-xl"
              >
                <MessageCircle className="mx-auto" />
              </button>

              <button
                onClick={() =>
                  updateStatus("won")
                }
                className="bg-blue-100 text-blue-700 p-4 rounded-xl"
              >
                <CheckCircle className="mx-auto" />
              </button>

              <button
                onClick={() =>
                  updateStatus("lost")
                }
                className="bg-red-100 text-red-700 p-4 rounded-xl"
              >
                <XCircle className="mx-auto" />
              </button>
            </div>

            {/* QUICK EDIT */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-5">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setUpdateOpen(true)
                  }
                  className="bg-indigo-100 text-indigo-700 py-4 rounded-2xl font-semibold"
                >
                  Edit Lead
                </button>

                <button
                  onClick={() =>
                    setReassignOpen(true)
                  }
                  className="bg-purple-100 text-purple-700 py-4 rounded-2xl font-semibold"
                >
                  Reassign
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <select
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(
                      e.target.value
                    )
                  }
                  className="p-4 rounded-2xl border"
                >
                  <option value="cold">
                    Cold
                  </option>
                  <option value="warm">
                    Warm
                  </option>
                  <option value="hot">
                    Hot
                  </option>
                </select>

                <input
                  type="datetime-local"
                  value={followUpDate}
                  onChange={(e) =>
                    setFollowUpDate(
                      e.target.value
                    )
                  }
                  className="p-4 rounded-2xl border"
                  placeholder="Follow-up date"
                />

                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) =>
                    setScheduledDate(
                      e.target.value
                    )
                  }
                  className="p-4 rounded-2xl border"
                  placeholder="Schedule date"
                />
              </div>

              <button
                onClick={handleQuickSave}
                className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-2xl font-semibold"
              >
                Save Quick Changes
              </button>
            </div>

            {/* LEAD INFO */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-5">
                Lead Information
              </h3>

              <div className="grid grid-cols-2 gap-5">
                <InfoRow
                  icon={<Mail size={18} />}
                  label="Email"
                  value={lead?.email}
                />

                <InfoRow
                  icon={
                    <Building2 size={18} />
                  }
                  label="Source"
                  value={lead?.source}
                />

                <InfoRow
                  icon={
                    <IndianRupee
                      size={18}
                    />
                  }
                  label="Budget"
                  value={lead?.budget}
                />

                <InfoRow
                  icon={<User size={18} />}
                  label="Assigned"
                  value={
                    lead?.assignedTo
                      ?.fullName ||
                    "Unassigned"
                  }
                />
              </div>

              {getProjectLabel(lead) !== "-" && (
                <div className="mt-5 bg-white p-4 rounded-2xl">
                  <p className="text-sm text-slate-500">
                    Project
                  </p>

                  <p className="font-medium mt-2">
                    {getProjectLabel(lead)}
                  </p>
                </div>
              )}
            </div>

            {/* FOLLOW UPS */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-5">
                Follow-ups
              </h3>

              <div className="space-y-4">
                {followUps.length > 0 ? (
                  followUps.map(
                    (item: any) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-2xl p-4 border"
                      >
                        <p className="font-semibold capitalize">
                          {
                            item.noteType
                          }
                        </p>

                        <p className="text-slate-600 mt-2">
                          {item.note}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-slate-400">
                    No follow-ups
                  </p>
                )}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-5">
                Activity Timeline
              </h3>

              <div className="space-y-4">
                {timeline.length > 0 ? (
                  timeline.map(
                    (item: any) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-2xl p-4 border"
                      >
                        <p className="font-semibold">
                          {
                            item.actionType
                          }
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                          {
                            item.newValue
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-slate-400">
                    No timeline
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <UpdateLeadDrawer
          open={updateOpen}
          onClose={() =>
            setUpdateOpen(false)
          }
          lead={lead}
          onSuccess={() => {
            setUpdateOpen(false);
            loadLead();
          }}
        />

        <ReassignLeadDrawer
          open={reassignOpen}
          onClose={() =>
            setReassignOpen(false)
          }
          onSuccess={() => {
            setReassignOpen(false);
            loadLead();
          }}
          leadId={leadId || ""}
        />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: any) {
  return (
    <div className="bg-white rounded-2xl p-4 border flex gap-3 items-center">
      <div className="text-slate-600">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-medium">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}