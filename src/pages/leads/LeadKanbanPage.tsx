import { useEffect, useState, useCallback, useRef } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

import {
    Search,
    Eye,
    Phone,
    MessageCircle,
    RefreshCcw,
    Building2,
    Flame,
    Filter,
    IndianRupee,
    Users,
    TrendingUp,
    CalendarDays,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getKanbanLeads,
    updateLead,
} from "../../api/leadApi";
import LeadPreviewDrawer from "../../components/leads/LeadPreviewDrawer";
import ScheduleDateModal from "../../components/leads/ScheduleDateModal";
import { getProjectLabel } from "../../utils/leadDisplay";
import {
    requiresScheduleDate,
} from "../../constants/scheduleStatuses";
import {
    toDatetimeLocalValue,
} from "../../utils/dateTimeLocal";

const STATUSES = [
    { key: "new", label: "NEW" },
    { key: "contacted", label: "CONTACTED" },
    { key: "follow_up", label: "FOLLOW UP" },
    { key: "site_visit_scheduled", label: "SITE VISIT" },
    { key: "site_visit_done", label: "VISIT DONE" },
    { key: "office_meeting_scheduled", label: "OFFICE SCHEDULED" },
    { key: "office_meeting_done", label: "OFFICE DONE" },
    { key: "virtual_meeting_scheduled", label: "VIRTUAL SCHEDULED" },
    { key: "virtual_meeting_done", label: "VIRTUAL DONE" },
    { key: "won", label: "WON" },
    { key: "lost", label: "LOST" },
];

const PAGE_LIMIT = 20;

type KanbanCacheEntry = {
    columns: any;
    search: string;
    city: string;
    source: string;
    temperature: string;
};

let kanbanCache: KanbanCacheEntry | null = null;

export default function LeadKanbanPage() {
    const cached = kanbanCache;
    const [search, setSearch] = useState(
        cached?.search ?? ""
    );
    const [city, setCity] = useState(
        cached?.city ?? ""
    );
    const [source, setSource] = useState(
        cached?.source ?? ""
    );
    const [temperature, setTemperature] =
        useState(cached?.temperature ?? "");

    const [columns, setColumns] = useState<any>(
        cached?.columns ?? {}
    );

    const [refreshing, setRefreshing] =
        useState(false);
    const loadingRef = useRef(false);

    const [, setLoading] =
        useState(false);

    const [dragLoading, setDragLoading] =
        useState(false);
    const [drawerOpen, setDrawerOpen] =
        useState(false);

    const [selectedLeadId, setSelectedLeadId] =
        useState<string | null>(null);

    const [scheduleModal, setScheduleModal] =
        useState<{
            leadId: string;
            status: string;
            leadName: string;
            initialDate?: string;
        } | null>(null);

    const [scheduleSaving, setScheduleSaving] =
        useState(false);
    const getTempClass = (temp: string) => {
        if (temp === "hot")
            return "bg-red-100 text-red-700";

        if (temp === "warm")
            return "bg-orange-100 text-orange-700";

        return "bg-blue-100 text-blue-700";
    };

    const openWhatsApp = (phone: string) => {
        window.open(
            `https://wa.me/91${phone}`,
            "_blank"
        );
    };

    const fetchColumn = async (
        status: string,
        page = 1
    ) => {
        return await getKanbanLeads({
            status,
            page,
            limit: PAGE_LIMIT,
            search,
            city,
            source,
            temperature,
        });
    };

    const loadAllColumns =
        useCallback(async (options?: {
            force?: boolean;
        }) => {
            const filtersMatch =
                kanbanCache &&
                kanbanCache.search === search &&
                kanbanCache.city === city &&
                kanbanCache.source === source &&
                kanbanCache.temperature ===
                    temperature;

            if (
                !options?.force &&
                filtersMatch
            ) {
                setColumns(
                    kanbanCache!.columns
                );
                setLoading(false);
                return;
            }

            if (loadingRef.current) {
                return;
            }

            loadingRef.current = true;

            if (kanbanCache) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            try {
                const results =
                    await Promise.all(
                        STATUSES.map((status) =>
                            fetchColumn(status.key)
                        )
                    );

                const mapped: any = {};

                STATUSES.forEach(
                    (status, index) => {
                        mapped[status.key] = {
                            leads:
                                results[index].leads || [],
                            total:
                                results[index].total || 0,
                            page: 1,
                            totalPages:
                                results[index].totalPages ||
                                1,
                        };
                    }
                );

                kanbanCache = {
                    columns: mapped,
                    search,
                    city,
                    source,
                    temperature,
                };

                setColumns(mapped);
            } catch (error) {
                console.error(error);
                toast.error(
                    "Failed to load pipeline"
                );
            } finally {
                loadingRef.current = false;
                setLoading(false);
                setRefreshing(false);
            }
        }, [search, city, source, temperature]);

    useEffect(() => {
        loadAllColumns();
    }, [loadAllColumns]);

    const loadMore = async (
        status: string
    ) => {
        const current = columns[status];

        if (
            !current ||
            current.page >= current.totalPages
        )
            return;

        try {
            const nextPage =
                current.page + 1;

            const res = await fetchColumn(
                status,
                nextPage
            );

            setColumns((prev: any) => ({
                ...prev,
                [status]: {
                    ...prev[status],
                    leads: [
                        ...prev[status].leads,
                        ...res.leads,
                    ],
                    page: nextPage,
                },
            }));
        } catch {
            toast.error("Load more failed");
        }
    };
    const handleDragEnd = async (
        result: any
    ) => {
        if (!result.destination) return;

        const leadId = result.draggableId;
        const sourceStatus =
            result.source.droppableId;
        const destinationStatus =
            result.destination.droppableId;

        if (
            sourceStatus === destinationStatus
        )
            return;

        // optimistic UI
        const sourceColumn =
            columns[sourceStatus];
        const destinationColumn =
            columns[destinationStatus];

        const movedLead =
            sourceColumn.leads.find(
                (lead: any) =>
                    lead._id === leadId
            );

        if (!movedLead) return;

        if (
            requiresScheduleDate(
                destinationStatus
            )
        ) {
            setScheduleModal({
                leadId,
                status: destinationStatus,
                leadName:
                    movedLead.fullName ||
                    "Lead",
                initialDate:
                    toDatetimeLocalValue(
                        movedLead.scheduledDate
                    ),
            });
            return;
        }

        const updatedSource =
            sourceColumn.leads.filter(
                (lead: any) =>
                    lead._id !== leadId
            );

        const updatedDestination = [
            {
                ...movedLead,
                status: destinationStatus,
            },
            ...destinationColumn.leads,
        ];

        setColumns((prev: any) => ({
            ...prev,
            [sourceStatus]: {
                ...prev[sourceStatus],
                leads: updatedSource,
                total:
                    prev[sourceStatus].total - 1,
            },
            [destinationStatus]: {
                ...prev[destinationStatus],
                leads: updatedDestination,
                total:
                    prev[destinationStatus].total +
                    1,
            },
        }));

        try {
            setDragLoading(true);

            await updateLead(leadId, {
                status: destinationStatus,
            });

            toast.success(
                "Lead moved successfully"
            );
        } catch {
            toast.error(
                "Move failed, restoring..."
            );

            loadAllColumns({ force: true });
        } finally {
            setDragLoading(false);
        }
    };

    const handleScheduleConfirm = async (
        scheduledDate: string
    ) => {
        if (!scheduleModal) return;

        try {
            setScheduleSaving(true);

            await updateLead(
                scheduleModal.leadId,
                {
                    status:
                        scheduleModal.status,
                    scheduledDate,
                }
            );

            toast.success(
                "Schedule saved successfully"
            );

            setScheduleModal(null);
            await loadAllColumns({
                force: true,
            });
        } catch {
            toast.error(
                "Schedule save failed"
            );
        } finally {
            setScheduleSaving(false);
        }
    };

    const totalLeads =
        Object.values(columns).reduce(
            (sum: number, col: any) =>
                sum + (col?.total || 0),
            0
        );

    const wonLeads =
        columns?.won?.total || 0;

    const activePipeline =
        totalLeads - wonLeads;

    return (
        <div className="space-y-5">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-lg shadow-sm p-4 text-white">
                <div className="flex justify-between flex-wrap gap-3 items-center">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Lead Pipeline
                        </h1>
                        <p className="text-slate-300 text-sm mt-0.5">
                            Kanban board
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            void loadAllColumns({
                                force: true,
                            })
                        }
                        disabled={refreshing}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition disabled:opacity-60"
                        title="Refresh pipeline"
                    >
                        <RefreshCcw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div className="bg-white/10 rounded-lg p-3">
                        <Users size={18} />
                        <p className="text-slate-300 text-xs mt-2">
                            Total Leads
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {totalLeads}
                        </h3>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3">
                        <TrendingUp size={18} />
                        <p className="text-slate-300 text-xs mt-2">
                            Active Pipeline
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {activePipeline}
                        </h3>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3">
                        <Flame size={18} />
                        <p className="text-slate-300 text-xs mt-2">
                            Won Deals
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                            {wonLeads}
                        </h3>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3">
                        <CalendarDays size={18} />
                        <p className="text-slate-300 text-xs mt-2">
                            Live Status
                        </p>
                        <h3 className="text-sm font-semibold mt-1">
                            {dragLoading
                                ? "Syncing..."
                                : "Healthy"}
                        </h3>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search leads..."
                            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-slate-900"
                        />
                    </div>

                    <input
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                        placeholder="City"
                        className="px-3 py-2 rounded-lg text-sm text-slate-900"
                    />

                    <input
                        value={source}
                        onChange={(e) =>
                            setSource(e.target.value)
                        }
                        placeholder="Source"
                        className="px-3 py-2 rounded-lg text-sm text-slate-900"
                    />

                    <select
                        value={temperature}
                        onChange={(e) =>
                            setTemperature(
                                e.target.value
                            )
                        }
                        className="px-4 py-4 rounded-2xl text-slate-900"
                    >
                        <option value="">
                            All Temperature
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
                </div>
            </div>

            <DragDropContext
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {STATUSES.map((status) => {
                        const column =
                            columns[status.key];

                        return (
                            <Droppable
                                droppableId={status.key}
                                key={status.key}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 w-96 flex-shrink-0"
                                    >
                                        {/* COLUMN HEADER */}
                                        <div className="sticky top-0 bg-slate-50 z-10 pb-4 border-b border-slate-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900">
                                                        {status.label}
                                                    </h2>

                                                    <p className="text-slate-500 text-sm">
                                                        {column?.total || 0} leads
                                                    </p>
                                                </div>

                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                                                    <Filter size={18} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CARDS */}
                                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pt-4">
                                            {column?.leads?.map(
                                                (
                                                    lead: any,
                                                    index: number
                                                ) => (
                                                    <Draggable
                                                        draggableId={lead._id}
                                                        index={index}
                                                        key={lead._id}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-grab"
                                                            >
                                                                {/* TOP */}
                                                                <div className="flex justify-between gap-3">
                                                                    <div>
                                                                        <h3 className="font-bold text-lg text-slate-900">
                                                                            {
                                                                                lead.fullName
                                                                            }
                                                                        </h3>

                                                                        <p className="text-sm text-slate-500 mt-1">
                                                                            📞{" "}
                                                                            {
                                                                                lead.phone
                                                                            }
                                                                        </p>

                                                                        <p className="text-sm text-slate-500">
                                                                            📍{" "}
                                                                            {lead.city ||
                                                                                "N/A"}
                                                                        </p>
                                                                    </div>

                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-semibold h-fit ${getTempClass(
                                                                            lead.temperature
                                                                        )}`}
                                                                    >
                                                                        {lead.temperature?.toUpperCase()}
                                                                    </span>
                                                                </div>

                                                                {/* INFO */}
                                                                <div className="mt-4 space-y-2">
                                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                        <Building2
                                                                            size={16}
                                                                        />
                                                                        <span>
                                                                            {
                                                                                lead.source
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                        <IndianRupee
                                                                            size={16}
                                                                        />
                                                                        <span>
                                                                            {lead.budget ||
                                                                                "Budget not specified"}
                                                                        </span>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                        <Users
                                                                            size={16}
                                                                        />
                                                                        <span>
                                                                            Assigned:{" "}
                                                                            {lead
                                                                                .assignedTo
                                                                                ?.fullName ||
                                                                                "Unassigned"}
                                                                        </span>
                                                                    </div>

                                                                    {getProjectLabel(lead) !== "-" && (
                                                                        <div className="text-xs text-slate-500 bg-slate-100 rounded-xl px-3 py-2 mt-2">
                                                                            {getProjectLabel(lead)}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* ACTIONS */}
                                                                <div className="flex gap-3 mt-5">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedLeadId(lead._id);
                                                                            setDrawerOpen(true);
                                                                        }}
                                                                        className="flex-1 p-3 rounded-2xl bg-blue-100 text-blue-700 hover:scale-105 transition"
                                                                    >
                                                                        <Eye
                                                                            size={18}
                                                                            className="mx-auto"
                                                                        />
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            window.open(
                                                                                `tel:${lead.phone}`
                                                                            )
                                                                        }
                                                                        className="flex-1 p-3 rounded-2xl bg-green-100 text-green-700 hover:scale-105 transition"
                                                                    >
                                                                        <Phone
                                                                            size={18}
                                                                            className="mx-auto"
                                                                        />
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            openWhatsApp(
                                                                                lead.phone
                                                                            )
                                                                        }
                                                                        className="flex-1 p-3 rounded-2xl bg-emerald-100 text-emerald-700 hover:scale-105 transition"
                                                                    >
                                                                        <MessageCircle
                                                                            size={18}
                                                                            className="mx-auto"
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            )}

                                            {provided.placeholder}

                                            {/* LOAD MORE */}
                                            {column &&
                                                column.page <
                                                column.totalPages && (
                                                    <button
                                                        onClick={() =>
                                                            loadMore(
                                                                status.key
                                                            )
                                                        }
                                                        className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-semibold transition"
                                                    >
                                                        Load More Leads
                                                    </button>
                                                )}

                                            {/* EMPTY */}
                                            {column?.leads?.length ===
                                                0 && (
                                                    <div className="text-center py-16 text-slate-400">
                                                        No leads found
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            <LeadPreviewDrawer
                open={drawerOpen}
                leadId={selectedLeadId}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedLeadId(null);
                }}
            />

            <ScheduleDateModal
                open={Boolean(scheduleModal)}
                leadName={
                    scheduleModal?.leadName
                }
                status={
                    scheduleModal?.status
                }
                initialDate={
                    scheduleModal?.initialDate
                }
                loading={scheduleSaving}
                onCancel={() =>
                    setScheduleModal(null)
                }
                onConfirm={
                    handleScheduleConfirm
                }
            />
        </div>
  );
}
