import { useState, useEffect } from "react";
import { updateLead } from "../../api/leadApi";
import toast from "react-hot-toast";
import {
  LEAD_STATUS_OPTIONS,
} from "../../constants/leadStatuses";
import {
  requiresScheduleDate,
} from "../../constants/scheduleStatuses";
import ScheduleDateModal from "./ScheduleDateModal";
import {
  toDatetimeLocalValue,
} from "../../utils/dateTimeLocal";

export function UpdateLeadDrawer({
  open,
  onClose,
  lead,
  onSuccess,
}: any) {
  const [status, setStatus] = useState(lead?.status || "");
  const [temperature, setTemperature] = useState(lead?.temperature || "");
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status || "");
      setTemperature(lead.temperature || "");
      setScheduledDate(
        toDatetimeLocalValue(
          lead.scheduledDate
        )
      );
    }
  }, [lead]);

  if (!open) return null;

  const saveLead = async (
    nextStatus: string,
    nextScheduledDate?: string
  ) => {
    try {
      setLoading(true);

      const payload: Record<string, string> = {
        status: nextStatus,
        temperature,
      };

      if (
        requiresScheduleDate(nextStatus) &&
        nextScheduledDate
      ) {
        payload.scheduledDate =
          nextScheduledDate;
      }

      const response = await updateLead(
        lead._id,
        payload
      );

      toast.success("Lead updated successfully");

      onSuccess?.(response?.lead || lead);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (
      requiresScheduleDate(status) &&
      !scheduledDate &&
      !lead?.scheduledDate
    ) {
      setScheduleModalOpen(true);
      return;
    }

    await saveLead(
      status,
      scheduledDate || undefined
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
        <div className="w-full max-w-xl bg-white h-full shadow-2xl p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Update Lead
            </h2>

            <button onClick={onClose}>✕</button>
          </div>

          <div className="space-y-5">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-100"
            >
              {LEAD_STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            {requiresScheduleDate(status) && (
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(event) =>
                  setScheduledDate(
                    event.target.value
                  )
                }
                className="w-full p-4 rounded-2xl bg-slate-100"
              />
            )}

            <select
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-100"
            >
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 rounded-2xl font-semibold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <ScheduleDateModal
        open={scheduleModalOpen}
        leadName={lead?.fullName}
        status={status}
        initialDate={scheduledDate}
        loading={loading}
        onCancel={() =>
          setScheduleModalOpen(false)
        }
        onConfirm={async (nextDate) => {
          setScheduledDate(nextDate);
          setScheduleModalOpen(false);
          await saveLead(status, nextDate);
        }}
      />
    </>
  );
}
