import {
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
  getLeadFilterOptions,

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

function LeadList({ mode }: Props) {
  return <LeadListContent key={mode} mode={mode} />;
}

function LeadListContent({ mode }: Props) {
  const navigate = useNavigate();
  const listPath =
    mode === "my"
      ? "/leads/my"
      : mode === "assigned"
        ? "/leads/assigned"
        : "/leads/all";
  const [leads, setLeads] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const requestId = useRef(0);
  const appliedParams = useRef<ReturnType<typeof getLeadParams>>({} as ReturnType<typeof getLeadParams>);
  const [search, setSearch] = useState(
    ""
  );
  const [status, setStatus] = useState(
    ""
  );
  const [dateRange, setDateRange] = useState(
    ""
  );
  const [fromDate, setFromDate] = useState(
    ""
  );
  const [toDate, setToDate] = useState(
    ""
  );
  const [temperature, setTemperature] = useState(
    ""
  );
  const [projectName, setProjectName] = useState(
    ""
  );
  const [source, setSource] = useState(
    ""
  );

  const [campaignName, setCampaignName] = useState(
    ""
  );
  const [adSetName, setAdSetName] = useState(
    ""
  );
  const [adName, setAdName] = useState(
    ""
  );

  const [city, setCity] = useState(
    ""
  );
  const [propertyType, setPropertyType] = useState(
    ""
  );
  const [budget, setBudget] = useState(
    ""
  );

  const [brandId, setBrandId] = useState(
    ""
  );
  const [sourceType, setSourceType] = useState(
    ""
  );
  const [isDuplicate, setIsDuplicate] = useState(
    ""
  );

  const [advancedFilters, setAdvancedFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
  projects: [] as string[],
  sources: [] as string[],
  sourceTypes: [] as string[],
  campaigns: [] as string[],
  adSets: [] as string[],
  adNames: [] as string[],
  cities: [] as string[],
  propertyTypes: [] as string[],
  budgets: [] as string[],
  brands: [] as string[],
});

const [filterOptionsLoading, setFilterOptionsLoading] =
  useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [optionsVersion, setOptionsVersion] = useState(0);
  const [teamUsers, setTeamUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] =
    useState("");
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

    brandId: brandId || undefined,
    projectName: projectName || undefined,
    source: source || undefined,
    sourceType: sourceType || undefined,

    campaignName: campaignName || undefined,
    adSetName: adSetName || undefined,
    adName: adName || undefined,

    city: city || undefined,
    propertyType: propertyType || undefined,
    budget: budget || undefined,
    isDuplicate: isDuplicate || undefined,
  });
  const fetchLeads = async (options?: {
    silent?: boolean;
    force?: boolean;
    params?: ReturnType<typeof getLeadParams>;
  }) => {
    const id = ++requestId.current;
    const params = options?.params ?? appliedParams.current;
    setRefreshing(true);
    setSelectedLeadIds([]);
    try {
      const res = mode === "all" ? await getAllLeads(params)
        : mode === "assigned" ? await getAssignedLeads(params)
        : await getMyLeads(params);
      if (id !== requestId.current) return;
      appliedParams.current = params;
      setLeads(res.leads || []);
    } catch (error) {
      if (id === requestId.current) {
        console.error(error);
        toast.error("Failed to load leads");
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    void fetchLeads();
    if (mode !== "my") void fetchTeamUsers();
    return () => { requestId.current++; };
  }, [mode]);
  useEffect(() => {
  let active = true;

  const loadFilterOptions = async () => {
    try {
      setFilterOptionsLoading(true);

      const res = await getLeadFilterOptions({
        mode,
        projectName: projectName || undefined,
        source: source || undefined,
        campaignName: campaignName || undefined,
        adSetName: adSetName || undefined,
      });

      if (active && res.success) {
        setFilterOptions(res.options);
      }
    } catch (error) {
      if (active) {
        console.error("Filter options error:", error);
        toast.error("Failed to load filter options");
      }
    } finally {
      if (active) {
        setFilterOptionsLoading(false);
      }
    }
  };

  void loadFilterOptions();

  return () => {
    active = false;
  };
}, [
  mode,
  projectName,
  source,
  campaignName,
  adSetName,
  optionsVersion,
]);
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
    if (dateRange === "custom" && (!fromDate || !toDate || fromDate > toDate)) {
      toast.error("Select a valid date range");
      return;
    }
    await fetchLeads({ params: getLeadParams() });
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setTemperature("");
    setSelectedUserId("");
    setDateRange("");
    setFromDate("");
    setToDate("");
    setBrandId("");
    setProjectName("");
    setSource("");
    setSourceType("");
    setCampaignName("");
    setAdSetName("");
    setAdName("");
    setCity("");
    setPropertyType("");
    setBudget("");
    setIsDuplicate("");
    void fetchLeads({ params: {} as ReturnType<typeof getLeadParams> });
    setOptionsVersion((v) => v + 1);
  };

  const handleLeadUpdated = (_updatedLead: any) => {
    void fetchLeads();
    setOptionsVersion((v) => v + 1);
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
  ...appliedParams.current,
  mode,
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
        window.URL.revokeObjectURL(url);

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
      if (!assignUserId || selectedLeadIds.length === 0) {
        toast.error(
          "Select user"
        );
        return;
      }

      try {
        await bulkAssignLeads(
          selectedLeadIds,
          assignUserId
        );

        toast.success(
          "Leads assigned successfully"
        );

        setAssignOpen(false);
        setAssignUserId("");
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
              setOptionsVersion((v) => v + 1);
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
                { setAssignUserId(""); setAssignOpen(true); }
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
          {mode !== "my" &&
            hasRole([
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
                      "admin",
                      "sales_manager",
                      "sales_executive",
                      "telecaller",
                    ].includes(user.role)
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

          <button
            type="button"
            onClick={() => setAdvancedFilters((current) => !current)}
            className="bg-slate-200 text-slate-800 rounded-xl py-3 flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            {advancedFilters ? "Hide Filters" : "More Filters"}
          </button>
        </div>

        {advancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
            <select aria-label="Projects" value={projectName}
              onChange={(e) => { setProjectName(e.target.value); setCampaignName(""); setAdSetName(""); setAdName(""); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Projects</option>
              {projectName && !filterOptions.projects.includes(projectName) && <option value={projectName}>{projectName}</option>}
              {filterOptions.projects.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Sources" value={source}
              onChange={(e) => { setSource(e.target.value); setCampaignName(""); setAdSetName(""); setAdName(""); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Sources</option>
              {source && !filterOptions.sources.includes(source) && <option value={source}>{source}</option>}
              {filterOptions.sources.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Campaigns" value={campaignName}
              onChange={(e) => { setCampaignName(e.target.value); setAdSetName(""); setAdName(""); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Campaigns</option>
              {campaignName && !filterOptions.campaigns.includes(campaignName) && <option value={campaignName}>{campaignName}</option>}
              {filterOptions.campaigns.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Ad Sets" value={adSetName}
              onChange={(e) => { setAdSetName(e.target.value); setAdName(""); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Ad Sets</option>
              {adSetName && !filterOptions.adSets.includes(adSetName) && <option value={adSetName}>{adSetName}</option>}
              {filterOptions.adSets.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Ads" value={adName}
              onChange={(e) => { setAdName(e.target.value); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Ads</option>
              {adName && !filterOptions.adNames.includes(adName) && <option value={adName}>{adName}</option>}
              {filterOptions.adNames.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Cities" value={city}
              onChange={(e) => { setCity(e.target.value); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Cities</option>
              {city && !filterOptions.cities.includes(city) && <option value={city}>{city}</option>}
              {filterOptions.cities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Source Types" value={sourceType}
              onChange={(e) => { setSourceType(e.target.value); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Source Types</option>
              {sourceType && !filterOptions.sourceTypes.includes(sourceType) && <option value={sourceType}>{sourceType}</option>}
              {filterOptions.sourceTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Property Types" value={propertyType}
              onChange={(e) => { setPropertyType(e.target.value); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Property Types</option>
              {propertyType && !filterOptions.propertyTypes.includes(propertyType) && <option value={propertyType}>{propertyType}</option>}
              {filterOptions.propertyTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Budgets" value={budget}
              onChange={(e) => { setBudget(e.target.value); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Budgets</option>
              {budget && !filterOptions.budgets.includes(budget) && <option value={budget}>{budget}</option>}
              {filterOptions.budgets.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Brand IDs" value={brandId}
              onChange={(e) => { setBrandId(e.target.value); }}
              disabled={filterOptionsLoading}
              className="w-full min-w-0 bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Brand IDs</option>
              {brandId && !filterOptions.brands.includes(brandId) && <option value={brandId}>{brandId}</option>}
              {filterOptions.brands.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select aria-label="Duplicate leads" value={isDuplicate} onChange={(e) => setIsDuplicate(e.target.value)} className="bg-slate-100 rounded-xl px-4 py-3">
              <option value="">All Lead Types</option>
              <option value="true">Duplicate Leads</option>
              <option value="false">Non-duplicate Leads</option>
            </select>
          </div>
        )}
        <div className="flex items-center gap-3 mt-4">
          <button type="button" onClick={handleResetFilters} className="bg-slate-200 rounded-xl px-4 py-2">Reset Filters</button>
          {filterOptionsLoading && <span className="text-sm text-slate-500">Loading filter options...</span>}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[2050px]">
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
                <th className="px-6 py-5 text-left whitespace-nowrap">
                  Campaign Name
                </th>

                <th className="px-6 py-5 text-left whitespace-nowrap">
                  Ad Set Name
                </th>

                <th className="px-6 py-5 text-left whitespace-nowrap">
                  Ad Name
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
                  <td className="px-6 py-5 text-sm min-w-[220px]">
                    <span className={lead.campaignName
                      ? "font-medium text-slate-700"
                      : "text-slate-400"}>
                      {lead.campaignName || "—"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm min-w-[200px]">
                    <span className={lead.adSetName
                      ? "text-slate-700"
                      : "text-slate-400"}>
                      {lead.adSetName || "—"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm min-w-[200px]">
                    <span className={lead.adName
                      ? "text-slate-700"
                      : "text-slate-400"}>
                      {lead.adName || "—"}
                    </span>
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
              value={assignUserId}
              onChange={(e) =>
                setAssignUserId(
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
                    String(user.role)
                      .trim()
                      .toLowerCase()
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
          setOptionsVersion((v) => v + 1);
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
          setOptionsVersion((v) => v + 1);
        }}
      />
    </div>
  );
}

export default LeadList;