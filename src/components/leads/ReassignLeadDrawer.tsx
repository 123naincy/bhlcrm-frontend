import { useEffect, useState } from "react";
import { reassignLead } from "../../api/leadApi";
import { getEmployees } from "../../api/employeeApi";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  leadId?: string;
  lead?: any;
  onSave?: () => void;
  onSuccess?: () => void;
}

export function ReassignLeadDrawer({
  open,
  onClose,
  leadId,
  lead,
  onSave,
  onSuccess,
}: Props) {
  const [employeeId, setEmployeeId] =
    useState("");

  const [employees, setEmployees] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    fetchingEmployees,
    setFetchingEmployees,
  ] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadEmployees =
      async () => {
        try {
          setFetchingEmployees(true);

          const res =
            await getEmployees();

          setEmployees(
            res.employees ||
              res ||
              []
          );
        } catch (error) {
          console.error(error);
          toast.error(
            "Failed to load employees"
          );
        } finally {
          setFetchingEmployees(false);
        }
      };

    loadEmployees();
  }, [open]);

  if (!open) return null;

  const finalLeadId =
    leadId || lead?._id;

  const handleReassign =
    async () => {
      if (!finalLeadId) {
        toast.error(
          "Lead ID missing"
        );
        return;
      }

      if (!employeeId) {
        toast.error(
          "Please select employee"
        );
        return;
      }

      try {
        setLoading(true);

        await reassignLead(
          finalLeadId,
          employeeId
        );

        toast.success(
          "Lead reassigned"
        );

        if (onSave) onSave();
        if (onSuccess) onSuccess();

        onClose();
      } catch (error) {
        console.error(error);
        toast.error(
          "Reassign failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 bg-black/40 z-[99999] flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            Reassign Lead
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {fetchingEmployees ? (
          <div className="text-center py-10">
            Loading employees...
          </div>
        ) : (
          <>
            <select
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-2xl bg-slate-100 mb-6"
            >
              <option value="">
                Select Employee
              </option>

              {employees.map(
                (emp) => (
                  <option
                    key={emp._id}
                    value={emp._id}
                  >
                    {emp.fullName} (
                    {emp.role})
                  </option>
                )
              )}
            </select>

            <button
              onClick={
                handleReassign
              }
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 rounded-2xl font-semibold"
            >
              {loading
                ? "Reassigning..."
                : "Reassign Lead"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReassignLeadDrawer;