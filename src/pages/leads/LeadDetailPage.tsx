import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getLeadById,
  updateLeadStatus,
  addLeadNote,
} from "../../api/leadApi";
import toast from "react-hot-toast";
import { getProjectLabel } from "../../utils/leadDisplay";

export default function LeadDetailPage() {
  const { id } = useParams();

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
  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);

      const res =
        await getLeadById(id!);

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
      try {
        await updateLeadStatus(
          id!,
          selectedStatus
        );

        toast.success(
          "Status updated"
        );

        fetchLead();
      } catch (error) {
        console.error(error);

        toast.error(
          "Status update failed"
        );
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
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xl font-semibold text-slate-500">
        Loading lead...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-red-500">
        Lead not found
      </div>
    );
  }

  return (
    <div className="space-y-5">
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
              <option value="new">
                New
              </option>

              <option value="assigned">
                Assigned
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="follow_up">
                Follow Up
              </option>

              <option value="interested">
                Interested
              </option>

              <option value="site_visit_scheduled">
                Site Visit Scheduled
              </option>

              <option value="site_visit_done">
                Site Visit Done
              </option>

              <option value="negotiation">
                Negotiation
              </option>

              <option value="won">
                Won
              </option>

              <option value="lost">
                Lost
              </option>

              <option value="junk">
                Junk
              </option>
            </select>

            <button
              onClick={
                handleStatusUpdate
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Update Status
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
    </div>
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