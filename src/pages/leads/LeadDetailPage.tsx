import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  getLeadById,
  updateLead,
  addLeadNote,
  deleteLead,
} from "../../api/leadApi";
import toast from "react-hot-toast";
import { getProjectLabel } from "../../utils/leadDisplay";
import {
  LEAD_STATUS_OPTIONS,
} from "../../constants/leadStatuses";
import {
  requiresScheduleDate,
} from "../../constants/scheduleStatuses";
import ScheduleDateModal from "../../components/leads/ScheduleDateModal";
import {
  formatDisplayDateTime,
  toDatetimeLocalValue,
} from "../../utils/dateTimeLocal";
import {
  getLeadRecordings,
} from "../../api/callLogApi";
import RecordingPlayer from "../../components/leads/RecordingPlayer";
import { getCurrentUser } from "../../utils/auth";

function getLeadListPath() {
  const role = getCurrentUser()?.role;

  switch (role) {
    case "sales_executive":
    case "telecaller":
      return "/leads/my";
    case "sales_manager":
      return "/leads/assigned";
    case "super_admin":
    case "admin":
      return "/leads/all";
    default:
      return "/leads/all";
  }
}

function getLeadListLabel(path: string) {
  if (path.includes("/my")) {
    return "Back to My Leads";
  }

  if (path.includes("/assigned")) {
    return "Back to Assigned Leads";
  }

  if (path.includes("/kanban")) {
    return "Back to Kanban";
  }

  if (path.includes("/all")) {
    return "Back to All Leads";
  }

  if (path.includes("/dashboard")) {
    return "Back to Dashboard";
  }

  return "Back to Leads";
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const backPath =
    (
      location.state as {
        from?: string;
      }
    )?.from || getLeadListPath();

  const backLabel =
    getLeadListLabel(backPath);
  const [recordings, setRecordings] =
    useState<any[]>([]);
  const [lead, setLead] =
    useState<any>(null);

  const [activities, setActivities] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");

  const [noteText, setNoteText] =
    useState("");

  const [scheduledDate, setScheduledDate] =
    useState("");

  const [scheduleModalOpen, setScheduleModalOpen] =
    useState(false);

  const [statusSaving, setStatusSaving] =
    useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const canDeleteLead =
    user?.role === "super_admin";
  const fetchLead = async () => {
    try {
      setLoading(true);

      const res =
        await getLeadById(id!);
      const recordingRes =
        await getLeadRecordings(id!);

      setRecordings(
        recordingRes.logs || []
      );
      setLead(res.lead);
      setActivities(
        res.activities || []
      );

      setSelectedStatus(
        res.lead.status || "new"
      );

      setNoteText(
        res.lead.notes || ""
      );

      setScheduledDate(
        toDatetimeLocalValue(
          res.lead.scheduledDate
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load lead"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleStatusUpdate =
    async () => {
      if (
        requiresScheduleDate(
          selectedStatus
        ) &&
        !scheduledDate &&
        !lead?.scheduledDate
      ) {
        setScheduleModalOpen(true);
        return;
      }

      try {
        setStatusSaving(true);

        await updateLead(id!, {
          status: selectedStatus,
          ...(requiresScheduleDate(
            selectedStatus
          ) && scheduledDate
            ? { scheduledDate }
            : {}),
        });

        toast.success(
          "Status updated"
        );

        fetchLead();
      } catch (error) {
        console.error(error);

        toast.error(
          "Status update failed"
        );
      } finally {
        setStatusSaving(false);
      }
    };

  const handleScheduleModalConfirm = async (
    nextScheduledDate: string
  ) => {
    try {
      setStatusSaving(true);

      await updateLead(id!, {
        status: selectedStatus,
        scheduledDate: nextScheduledDate,
      });

      setScheduledDate(nextScheduledDate);
      setScheduleModalOpen(false);

      toast.success(
        "Schedule saved"
      );

      fetchLead();
    } catch (error) {
      console.error(error);
      toast.error(
        "Schedule save failed"
      );
    } finally {
      setStatusSaving(false);
    }
  };

  const handleSaveNote =
    async () => {
      try {
        await addLeadNote(
          id!,
          noteText
        );

        toast.success(
          "Note saved"
        );

        fetchLead();
      } catch (error) {
        console.error(error);

        toast.error(
          "Note save failed"
        );
      }
    };

  const handleDeleteLead = async () => {
    if (
      !confirm(
        "Delete this lead permanently? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteLead(id!);
      toast.success("Lead deleted");
      navigate(backPath);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lead");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <BackButton
          label={backLabel}
          onClick={() =>
            navigate(backPath)
          }
        />

        <div className="min-h-[60vh] flex items-center justify-center text-xl font-semibold text-slate-500">
          Loading lead...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-4">
        <BackButton
          label={backLabel}
          onClick={() =>
            navigate(backPath)
          }
        />

        <div className="p-8 text-red-500">
          Lead not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <BackButton
          label={backLabel}
          onClick={() => navigate(backPath)}
        />

        {canDeleteLead && (
          <button
            onClick={handleDeleteLead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete Lead
          </button>
        )}
      </div>

      {/* TOP */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">
              {lead.fullName}
            </h1>

            <p className="text-slate-500 mt-2">
              {lead.phone}
            </p>

            <p className="text-slate-500">
              {lead.email || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <InfoCard
              label="Project"
              value={
                getProjectLabel(lead)
              }
            />

            <InfoCard
              label="Source"
              value={
                lead.source
              }
            />

            <InfoCard
              label="Status"
              value={
                lead.status
              }
            />

            <InfoCard
              label="Temperature"
              value={
                lead.temperature
              }
            />

            <InfoCard
              label="City"
              value={
                lead.city
              }
            />

            <InfoCard
              label="Budget"
              value={
                lead.budget ||
                "-"
              }
            />
          </div>
        </div>
      </div>

      {/* ASSIGNMENT */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold mb-4">
          Assignment
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            label="Assigned To"
            value={
              lead.assignedTo
                ?.fullName || "Unassigned"
            }
          />

          <InfoCard
            label="Assigned By"
            value={
              lead.assignedBy
                ?.fullName || "-"
            }
          />
        </div>
      </div>

      {/* NOTES */}
      {/* STATUS + NOTES */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-semibold mb-4">
            Update Status
          </h2>

          <div className="space-y-4">
            <select
              value={
                selectedStatus
              }
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
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

            {requiresScheduleDate(
              selectedStatus
            ) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Schedule Date
                </label>

                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(event) =>
                    setScheduledDate(
                      event.target.value
                    )
                  }
                  className="w-full border rounded-xl p-4"
                />

                {lead?.scheduledDate && (
                  <p className="mt-2 text-xs text-slate-500">
                    Current:{" "}
                    {formatDisplayDateTime(
                      lead.scheduledDate
                    )}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={
                handleStatusUpdate
              }
              disabled={statusSaving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl disabled:opacity-60"
            >
              {statusSaving
                ? "Updating..."
                : "Update Status"}
            </button>
          </div>
        </div>

        {/* NOTES */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <h2 className="text-sm font-semibold mb-4">
            Notes
          </h2>

          <textarea
            value={noteText}
            onChange={(e) =>
              setNoteText(
                e.target.value
              )
            }
            rows={6}
            className="w-full border rounded-xl p-4"
            placeholder="Add notes..."
          />

          <button
            onClick={
              handleSaveNote
            }
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Save Note
          </button>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-5 min-h-[120px]">
        {lead.notes || "No notes yet"}
      </div>
      {/* recording section */}
      {/* CALL RECORDINGS */}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold mb-4">
          Call Recordings
        </h2>

        {recordings.length === 0 ? (
          <p className="text-slate-500">
            No recordings found
          </p>
        ) : (
          <div className="space-y-3">
            {recordings.map(
              (recording: any) => (
                <RecordingPlayer
                  key={recording._id}
                  recording={recording}
                />
              )
            )}
          </div>
        )}
      </div>
      {/* TIMELINE */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-semibold mb-4">
          Timeline
        </h2>

        <div className="space-y-5">
          {activities.length === 0 ? (
            <p className="text-slate-500">
              No activities
            </p>
          ) : (
            activities.map(
              (activity) => (
                <div
                  key={
                    activity._id
                  }
                  className="border rounded-xl p-5"
                >
                  <p className="font-semibold">
                    {
                      activity.actionType
                    }
                  </p>

                  <p className="text-slate-500 text-sm mt-1">
                    {
                      activity.note
                    }
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    By{" "}
                    {
                      activity
                        .performedBy
                        ?.fullName
                    }{" "}
                    •{" "}
                    {new Date(
                      activity.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              )
            )
          )}
        </div>
      </div>

      <ScheduleDateModal
        open={scheduleModalOpen}
        leadName={lead?.fullName}
        status={selectedStatus}
        initialDate={scheduledDate}
        loading={statusSaving}
        onCancel={() =>
          setScheduleModalOpen(false)
        }
        onConfirm={
          handleScheduleModalConfirm
        }
      />
    </div>
  );
}

function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-100 rounded-xl p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-semibold mt-2">
        {value}
      </p>
    </div>
  );
}