import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import {
  formatScheduleStatusLabel,
} from "../../constants/scheduleStatuses";

type ScheduleDateModalProps = {
  open: boolean;
  leadName?: string;
  status?: string;
  initialDate?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (scheduledDate: string) => void;
};

export default function ScheduleDateModal({
  open,
  leadName,
  status,
  initialDate = "",
  loading = false,
  onCancel,
  onConfirm,
}: ScheduleDateModalProps) {
  const [scheduledDate, setScheduledDate] =
    useState(initialDate);

  useEffect(() => {
    if (open) {
      setScheduledDate(initialDate);
    }
  }, [open, initialDate]);

  if (!open) return null;

  const scheduleLabel =
    formatScheduleStatusLabel(status);

  const handleSubmit = () => {
    if (!scheduledDate) return;
    onConfirm(scheduledDate);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600">
              <CalendarDays size={18} />
              <span className="text-sm font-semibold">
                Schedule Date
              </span>
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {scheduleLabel}
            </h3>

            {leadName && (
              <p className="mt-1 text-sm text-slate-500">
                {leadName}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <label className="block text-sm font-medium text-slate-700">
            Kab schedule hai?
          </label>

          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(event) =>
              setScheduledDate(
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="text-xs text-slate-500">
            Ye date dashboard par aaj ke schedules mein dikhegi.
          </p>
        </div>

        <div className="flex gap-3 border-t px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !scheduledDate}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
