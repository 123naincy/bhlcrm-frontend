import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Search,
  Eye,
  Pencil,
  RefreshCcw,
  Filter,
  Trash2,
} from "lucide-react";

import {
  getAllLeads,
  getAssignedLeads,
  getMyLeads,
  exportLeads,
  bulkAssignLeads,
  deleteLead,
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
import {
  LEAD_STATUS_OPTIONS,
} from "../../constants/leadStatuses";
import { hasRole } from "../../utils/auth";

interface Props {
  mode: "all" | "assigned" | "my";
}

type LeadListMode = "all" | "assigned" | "my";

type LeadListCacheEntry = {
  leads: any[];
  search: string;
  status: string;
  dateRange: string;
  fromDate: string;
  toDate: string;
  temperature: string;
  selectedUserId: string;
};

const leadListCache: Partial<
  Record<LeadListMode, LeadListCacheEntry>
> = {};

function LeadList({ mode }: Props) {
  const navigate = useNavigate();
  const cached = leadListCache[mode];
  const listPath =
    mode === "my"
      ? "/leads/my"
      : mode === "assigned"
        ? "/leads/assigned"
        : "/leads/all";
  const [leads, setLeads] = useState<any[]>(
    cached?.leads ?? []
  );
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] =
    useState(false);
  const loadingRef = useRef(false);
  const [search, setSearch] = useState(
    cached?.search ?? ""
  );
  const [status, setStatus] = useState(
    cached?.status ?? ""
  );
  const [dateRange, setDateRange] = useState(
    cached?.dateRange ?? ""
  );
  const [fromDate, setFromDate] = useState(
    cached?.fromDate ?? ""
  );
  const [toDate, setToDate] = useState(
    cached?.toDate ?? ""
  );
  const [temperature, setTemperature] = useState(
    cached?.temperature ?? ""
  );
  const [importOpen, setImportOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [teamUsers, setTeamUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] =
    useState(cached?.selectedUserId ?? "");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [editLead, setEditLead] = useState<any>(null);
  const [reassignLeadId, setReassignLeadId] = useState<string | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const getLeadParams = () => ({
    search: search || undefined,
    status: status || undefined,
    temperature: temperature || undefined,
    assignedTo: selectedUserId || undefined,
    dateRange: dateRange || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  const fetchLeads = useCallback(
    async (options?: {
      silent?: boolean;
      force?: boolean;
    }) => {
      const silent =
        options?.silent ?? false;
      const force =
        options?.force ?? false;

      if (loadingRef.current) {
        return;
      }

      if (
        !force &&
        leadListCache[mode]
      ) {
        const entry =
          leadListCache[mode]!;

        setLeads(entry.leads);
        setSearch(entry.search);
        setStatus(entry.status);
        setDateRange(entry.dateRange);
        setFromDate(entry.fromDate);
        setToDate(entry.toDate);
        setTemperature(entry.temperature);
        setSelectedUserId(
          entry.selectedUserId
        );
        setLoading(false);
        return;
      }

      loadingRef.current = true;

      if (leadListCache[mode]) {
        setRefreshing(true);
      } else if (!silent) {
        setLoading(true);
      }

      try {
        let res;

        const params = getLeadParams();

        if (mode === "all") {
          res = await getAllLeads(params);
        } else if (
          mode === "assigned"
        ) {
          res =
            await getAssignedLeads(
              params
            );
        } else {
          res = await getMyLeads(params);
        }

        const nextLeads = res.leads || [];

        leadListCache[mode] = {
          leads: nextLeads,
          search,
          status,
          dateRange,
          fromDate,
          toDate,
          temperature,
          selectedUserId,
        };

        setLeads(nextLeads);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load leads"
        );
      } finally {
        loadingRef.current = false;

        if (!silent) {
          setLoading(false);
        }

        setRefreshing(false);
      }
    },
    [
      mode,
      search,
      status,
      dateRange,
      fromDate,
      toDate,
      temperature,
      selectedUserId,
    ]
  );

  useEffect(() => {
    void fetchLeads();

    if (mode !== "my") {
      fetchTeamUsers();
    }
  }, [mode]);

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

  const handleFilter = async () => {
    try {
      await fetchLeads({ force: true });
    } catch (error) {
      console.error(error);

      toast.error(
        "Filter failed"
      );
    }
  };

  const handleLeadUpdated = (
    updatedLead: any
  ) => {
    if (updatedLead) {
      setLeads((prev) => [
        updatedLead,
        ...prev.filter(
          (lead) =>
            lead._id !== updatedLead._id
        ),
      ]);
    }

    void fetchLeads({
      silent: true,
      force: true,
    });
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
          assignedTo:
            selectedUserId ||
            undefined,
          dateRange:
            dateRange ||
            undefined,
          fromDate:
            fromDate ||
            undefined,
          toDate:
            toDate ||
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

        fetchLeads({ force: true });
      } catch (error) {
        console.error(error);

        toast.error(
          "Assignment failed"
        );
      }
    };

  const handleDeleteLead = async (
    leadId: string,
    leadName: string
  ) => {
    if (
      !confirm(
        `Delete lead "${leadName}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteLead(leadId);
      toast.success("Lead deleted");
      setSelectedLeadIds((prev) =>
        prev.filter((id) => id !== leadId)
      );
      fetchLeads({ force: true });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lead");
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
            onClick={() => {
              void fetchLeads({ force: true });
            }}
            disabled={refreshing}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-300 disabled:opacity-60"
            title="Refresh list"
          >
            <RefreshCcw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
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
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
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
          {hasRole([
            "super_admin",
            "admin",
            "sales_manager",
          ]) && (
            <select
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(
                  e.target.value
                )
              }
              className="bg-slate-100 rounded-xl px-4 py-3"
            >
              <option value="">
                All Team Members
              </option>

              {teamUsers
                ?.filter((user: any) =>
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
                    {user.fullName}
                  </option>
                ))}
            </select>
          )}
          <select
            value={dateRange}
            onChange={(e) =>
              setDateRange(e.target.value)
            }
            className="bg-slate-100 rounded-xl px-4 py-3"
          >
            <option value="">
              Date Range
            </option>

            <option value="today">
              Today
            </option>

            <option value="yesterday">
              Yesterday
            </option>

            <option value="last7days">
              Last 7 Days
            </option>

            <option value="last30days">
              Last 30 Days
            </option>

            <option value="thisMonth">
              This Month
            </option>

            <option value="lastMonth">
              Last Month
            </option>

            <option value="custom">
              Custom Range
            </option>
          </select>

          {
            dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(
                      e.target.value
                    )
                  }
                  className="bg-slate-100 rounded-xl px-4 py-3"
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(
                      e.target.value
                    )
                  }
                  className="bg-slate-100 rounded-xl px-4 py-3"
                />
              </div>
            )
          }
          
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
                  Last Worked
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
                      lead.lastWorkedAt ||
                        lead.updatedAt ||
                        lead.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/leads/${lead._id}`,
                            {
                              state: {
                                from: listPath,
                              },
                            }
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

                      {hasRole(["super_admin"]) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteLead(
                              lead._id,
                              lead.fullName
                            )
                          }
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="Delete lead"
                        >
                          <Trash2 size={16} />
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
        onSuccess={(updatedLead: any) => {
          setUpdateOpen(false);
          setEditLead(null);
          handleLeadUpdated(updatedLead);
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
          fetchLeads({ force: true });
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
          fetchLeads({ force: true });
        }}
      />
    </div>
  );
}

export default LeadList;