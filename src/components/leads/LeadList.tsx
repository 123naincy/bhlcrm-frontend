import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Pencil,
  RefreshCcw,
  Filter,
} from "lucide-react";

import {
  getAllLeads,
  getAssignedLeads,
  getMyLeads,
  exportLeads,
  bulkAssignLeads,
} from "../../api/leadApi";

import { getTeamUsers } from "../../api/teamApi";

import StatusBadge from "../../components/leads/StatusBadge";
import TemperatureBadge from "../../components/leads/TemperatureBadge";
import ImportLeadModal from "../../components/leads/ImportLeadModal";
import { UpdateLeadDrawer } from "./UpdateLeadDrawer";
import { ReassignLeadDrawer } from "./ReassignLeadDrawer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProjectLabel } from "../../utils/leadDisplay";

interface Props {
  mode: "all" | "assigned" | "my";
}

function LeadList({ mode }: Props) {
  const navigate = useNavigate();
  const [leads, setLeads] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [
    temperature,
    setTemperature,
  ] = useState("");

  const [importOpen, setImportOpen] =
    useState(false);

  const [assignOpen, setAssignOpen] =
    useState(false);

  const [teamUsers, setTeamUsers] =
    useState<any[]>([]);

  const [
    selectedUserId,
    setSelectedUserId,
  ] = useState("");

  const [
    selectedLeadIds,
    setSelectedLeadIds,
  ] = useState<string[]>([]);

  const [editLead, setEditLead] =
    useState<any>(null);
  const [reassignLeadId, setReassignLeadId] =
    useState<string | null>(null);
  const [updateOpen, setUpdateOpen] =
    useState(false);
  const [reassignOpen, setReassignOpen] =
    useState(false);

  useEffect(() => {
    fetchLeads();

    if (mode !== "my") {
      fetchTeamUsers();
    }
  }, [mode]);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      let res;

      if (mode === "all") {
        res = await getAllLeads();
      } else if (
        mode === "assigned"
      ) {
        res =
          await getAssignedLeads();
      } else {
        res = await getMyLeads();
      }

      setLeads(res.leads || []);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load leads"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamUsers =
    async () => {
      try {
        const res =
          await getTeamUsers();

        setTeamUsers(
          res.users || []
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load team"
        );
      }
    };

  const handleFilter =
    async () => {
      try {
        setLoading(true);

        let res;

        if (mode === "all") {
          res =
            await getAllLeads();
        } else if (
          mode === "assigned"
        ) {
          res =
            await getAssignedLeads();
        } else {
          res =
            await getMyLeads();
        }

        let filtered =
          res.leads || [];

        if (search) {
          filtered =
            filtered.filter(
              (lead: any) =>
                lead.fullName
                  ?.toLowerCase()
                  .includes(
                    search.toLowerCase()
                  ) ||
                lead.phone?.includes(
                  search
                ) ||
                lead.email
                  ?.toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
            );
        }

        if (status) {
          filtered =
            filtered.filter(
              (lead: any) =>
                lead.status ===
                status
            );
        }

        if (temperature) {
          filtered =
            filtered.filter(
              (lead: any) =>
                lead.temperature ===
                temperature
            );
        }

        setLeads(filtered);
      } catch (error) {
        console.error(error);

        toast.error(
          "Filter failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const toggleLeadSelection = (
    leadId: string
  ) => {
    setSelectedLeadIds(
      (prev) =>
        prev.includes(leadId)
          ? prev.filter(
            (id) =>
              id !== leadId
          )
          : [
            ...prev,
            leadId,
          ]
    );
  };

  const toggleSelectAll = () => {
    if (
      selectedLeadIds.length ===
      leads.length
    ) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(
        leads.map(
          (lead: any) =>
            lead._id
        )
      );
    }
  };

  const handleExport =
    async () => {
      try {
        toast.loading(
          "Preparing Excel export...",
          {
            id: "export",
          }
        );

        const filters = {
          search:
            search ||
            undefined,
          status:
            status ||
            undefined,
          temperature:
            temperature ||
            undefined,
        };

        const blob =
          await exportLeads(
            filters
          );

        const url =
          window.URL.createObjectURL(
            new Blob([blob])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.setAttribute(
          "download",
          "leads-export.xlsx"
        );

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        toast.success(
          "Excel downloaded",
          {
            id: "export",
          }
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Export failed",
          {
            id: "export",
          }
        );
      }
    };

  const handleBulkAssign =
    async () => {
      if (!selectedUserId) {
        toast.error(
          "Select user"
        );
        return;
      }

      try {
        await bulkAssignLeads(
          selectedLeadIds,
          selectedUserId
        );

        toast.success(
          "Leads assigned successfully"
        );

        setAssignOpen(false);
        setSelectedUserId("");
        setSelectedLeadIds([]);

        fetchLeads();
      } catch (error) {
        console.error(error);

        toast.error(
          "Assignment failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xl font-semibold text-slate-500">
        Loading leads...
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {mode === "all"
              ? "All Leads"
              : mode === "assigned"
                ? "Assigned Leads"
                : "My Leads"}
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Manage your leads
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={fetchLeads}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-300"
            title="Refresh list"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>

          {mode !== "my" && (
            <>
              <button
                onClick={() =>
                  setImportOpen(true)
                }
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                IMPORT
              </button>

              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-5 py-3 rounded-xl"
              >
                EXPORT
              </button>
            </>
          )}

          {mode !== "my" && (
            <button
              onClick={() =>
                setAssignOpen(true)
              }
              disabled={
                selectedLeadIds.length === 0
              }
              className={`px-5 py-3 rounded-xl text-white ${selectedLeadIds.length === 0
                ? "bg-gray-400"
                : "bg-orange-600"
                }`}
            >
              Assign Selected (
              {selectedLeadIds.length})
            </button>
          )}
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-slate-100 rounded-xl pl-12 pr-4 py-3"
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="bg-slate-100 rounded-xl px-4 py-3"
          >
            <option value="">
              All Status
            </option>
            <option value="new">
              New
            </option>
            <option value="assigned">
              Assigned
            </option>
            <option value="contacted">
              Contacted
            </option>
            <option value="won">
              Won
            </option>
            <option value="lost">
              Lost
            </option>
          </select>

          <select
            value={temperature}
            onChange={(e) =>
              setTemperature(
                e.target.value
              )
            }
            className="bg-slate-100 rounded-xl px-4 py-3"
          >
            <option value="">
              All Temp
            </option>
            <option value="hot">
              Hot
            </option>
            <option value="warm">
              Warm
            </option>
            <option value="cold">
              Cold
            </option>
          </select>

          <button
            onClick={handleFilter}
            className="bg-purple-600 text-white rounded-xl py-3 flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-5 text-left">
                  <div className="flex items-center gap-3">
                    {mode !== "my" && (
                      <input
                        type="checkbox"
                        checked={
                          leads.length > 0 &&
                          selectedLeadIds.length ===
                          leads.length
                        }
                        onChange={
                          toggleSelectAll
                        }
                      />
                    )}

                    <span>Lead</span>
                  </div>
                </th>

                <th className="px-6 py-5 text-left">
                  Project
                </th>

                <th className="px-6 py-5 text-left">
                  Source
                </th>

                <th className="px-6 py-5 text-left">
                  Status
                </th>

                <th className="px-6 py-5 text-left">
                  Temperature
                </th>

                <th className="px-6 py-5 text-left">
                  Assigned To
                </th>

                <th className="px-6 py-5 text-left">
                  City
                </th>

                <th className="px-6 py-5 text-left">
                  Created
                </th>

                <th className="px-6 py-5 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <div className="flex gap-4 items-start">
                      {mode !== "my" && (
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(
                            lead._id
                          )}
                          onChange={() =>
                            toggleLeadSelection(
                              lead._id
                            )
                          }
                        />
                      )}

                      <div>
                        <h3 className="font-bold">
                          {lead.fullName}
                        </h3>

                        <p>
                          {lead.phone}
                        </p>

                        <p className="text-xs text-slate-400">
                          {lead.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-medium">
                    {getProjectLabel(lead)}
                  </td>

                  <td className="px-6 py-5">
                    {lead.source}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge
                      status={lead.status}
                    />
                  </td>

                  <td className="px-6 py-5">
                    <TemperatureBadge
                      temperature={
                        lead.temperature
                      }
                    />
                  </td>

                  <td className="px-6 py-5">
                    {lead.assignedTo ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                          {lead.assignedTo.fullName?.charAt(
                            0
                          )}
                        </div>

                        <div>
                          <p className="font-medium">
                            {
                              lead.assignedTo
                                .fullName
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              lead.assignedTo
                                .role
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    {lead.city}
                  </td>

                  <td className="px-6 py-5">
                    {new Date(
                      lead.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/leads/${lead._id}`
                          )
                        }
                        className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        title="View lead"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditLead(lead);
                          setUpdateOpen(true);
                        }}
                        className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                        title="Edit lead"
                      >
                        <Pencil size={16} />
                      </button>

                      {mode !== "my" && (
                        <button
                          type="button"
                          onClick={() => {
                            setReassignLeadId(
                              lead._id
                            );
                            setReassignOpen(true);
                          }}
                          className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                          title="Reassign lead"
                        >
                          <RefreshCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN MODAL */}
      {assignOpen && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold">
              Assign Leads
            </h2>

            <p>
              Selected Leads:
              {selectedLeadIds.length}
            </p>

            <select
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4"
            >
              <option value="">
                Select Team Member
              </option>

              {teamUsers
                .filter((user: any) =>
                  [
                    "sales_executive",
                    "telecaller",
                  ].includes(
                    user.role
                  )
                )
                .map((user: any) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.fullName} (
                    {user.role})
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() =>
                  setAssignOpen(false)
                }
                className="px-6 py-3 rounded-xl bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleBulkAssign
                }
                className="px-6 py-3 rounded-xl bg-orange-600 text-white"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <UpdateLeadDrawer
        open={updateOpen}
        onClose={() => {
          setUpdateOpen(false);
          setEditLead(null);
        }}
        lead={editLead}
        onSuccess={() => {
          setUpdateOpen(false);
          setEditLead(null);
          fetchLeads();
        }}
      />

      <ReassignLeadDrawer
        open={reassignOpen}
        leadId={reassignLeadId || ""}
        onClose={() => {
          setReassignOpen(false);
          setReassignLeadId(null);
        }}
        onSuccess={() => {
          setReassignOpen(false);
          setReassignLeadId(null);
          fetchLeads();
        }}
      />

      {/* IMPORT MODAL */}
      <ImportLeadModal
        open={importOpen}
        onClose={() =>
          setImportOpen(false)
        }
        onImported={() => {
          setImportOpen(false);
          fetchLeads();
        }}
      />
    </div>
  );
}

export default LeadList;