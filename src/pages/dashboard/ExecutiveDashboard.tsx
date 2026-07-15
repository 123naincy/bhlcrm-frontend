import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    PhoneCall,
    Clock3,
    Heart,
    MapPin,
    CheckCircle,
    Trophy,
    XCircle,
    Sparkles,
    Flame,
    ThermometerSun,
    Snowflake,
    ArrowRight,
    CalendarDays,
    AlertCircle,
    Kanban,
    List,
    RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import {
  getMyDashboard,
  getMyRecentFollowups,
  getMyTrend,
  getTodayFollowups,
  getTodaySchedules,
  getMyDailyActivity,
} from "../../api/dashboardApi";

import type {
  DailyActivityPoint,
  ExecutiveDashboardStats,
  ExecutiveFollowupLead,
  ExecutiveScheduleLead,
  MonthlyTrendPoint,
} from "../../types/dashboard";

import StatusBadge from "../../components/leads/StatusBadge";
import TemperatureBadge from "../../components/leads/TemperatureBadge";
import {
  formatScheduleStatusLabel,
} from "../../constants/scheduleStatuses";
import {
  formatDisplayDateTime,
} from "../../utils/dateTimeLocal";

const PIPELINE_COLORS = [
  "#4f46e5",
  "#f97316",
  "#ec4899",
  "#22c55e",
];

type ExecutiveDashboardCache = {
  stats: ExecutiveDashboardStats;
  followups: ExecutiveFollowupLead[];
  todayLeads: ExecutiveFollowupLead[];
  todayScheduleLeads: ExecutiveScheduleLead[];
  trendData: MonthlyTrendPoint[];
  activityData: DailyActivityPoint[];
  todayFollowups: number;
  todaySchedules: number;
};

let executiveDashboardCache:
  ExecutiveDashboardCache | null = null;

export default function ExecutiveDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] =
    useState<ExecutiveDashboardStats | null>(
      null
    );

  const [followups, setFollowups] =
    useState<ExecutiveFollowupLead[]>([]);

  const [todayLeads, setTodayLeads] =
    useState<ExecutiveFollowupLead[]>([]);

  const [todayScheduleLeads, setTodayScheduleLeads] =
    useState<ExecutiveScheduleLead[]>([]);

  const [trendData, setTrendData] =
    useState<MonthlyTrendPoint[]>([]);

  const [activityData, setActivityData] =
    useState<DailyActivityPoint[]>([]);

  const [todayFollowups, setTodayFollowups] =
    useState(0);

  const [todaySchedules, setTodaySchedules] =
    useState(0);

  const [loading, setLoading] =
    useState(!executiveDashboardCache);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadingRef = useRef(false);

  const applyCache = (
    cache: ExecutiveDashboardCache
  ) => {
    setStats(cache.stats);
    setFollowups(cache.followups);
    setTodayLeads(cache.todayLeads);
    setTodayScheduleLeads(
      cache.todayScheduleLeads
    );
    setTrendData(cache.trendData);
    setActivityData(cache.activityData);
    setTodayFollowups(
      cache.todayFollowups
    );
    setTodaySchedules(
      cache.todaySchedules
    );
  };

  const loadDashboard = useCallback(
    async (options?: {
      force?: boolean;
    }) => {
      if (loadingRef.current) {
        return;
      }

      if (
        executiveDashboardCache &&
        !options?.force
      ) {
        applyCache(
          executiveDashboardCache
        );
        setLoading(false);
        return;
      }

      loadingRef.current = true;

      if (executiveDashboardCache) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const results =
          await Promise.allSettled([
            getMyDashboard(),
            getMyRecentFollowups(),
            getMyTrend(),
            getTodayFollowups(),
            getTodaySchedules(),
            getMyDailyActivity(),
          ]);

        const dashboardRes =
          results[0].status ===
          "fulfilled"
            ? results[0].value
            : null;
        const followupRes =
          results[1].status ===
          "fulfilled"
            ? results[1].value
            : { leads: [] };
        const trendRes =
          results[2].status ===
          "fulfilled"
            ? results[2].value
            : { trend: [] };
        const todayRes =
          results[3].status ===
          "fulfilled"
            ? results[3].value
            : { leads: [], count: 0 };
        const scheduleRes =
          results[4].status ===
          "fulfilled"
            ? results[4].value
            : { leads: [], count: 0 };
        const activityRes =
          results[5].status ===
          "fulfilled"
            ? results[5].value
            : { activity: [] };

        if (!dashboardRes) {
          throw new Error(
            "Failed to load dashboard stats"
          );
        }

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(
              `Executive dashboard request ${index} failed:`,
              result.reason
            );
          }
        });

        const monthNames = [
          "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const nextTrendData = (
          trendRes?.trend || []
        ).map(
          (item: {
            _id?: { month?: number };
            leads?: number;
            won?: number;
          }) => ({
            month:
              monthNames[
                item._id?.month || 0
              ] || "",
            assigned:
              item.leads || 0,
            won: item.won || 0,
          })
        );

        const cache: ExecutiveDashboardCache =
          {
            stats: {
              ...dashboardRes,
              todaySchedules:
                scheduleRes.count ||
                dashboardRes?.todaySchedules ||
                0,
            },
            followups:
              followupRes.leads || [],
            todayLeads:
              todayRes.leads || [],
            todayScheduleLeads:
              scheduleRes.leads || [],
            todayFollowups:
              todayRes.count || 0,
            todaySchedules:
              scheduleRes.count ||
              dashboardRes?.todaySchedules ||
              0,
            activityData:
              activityRes.activity ||
              [],
            trendData: nextTrendData,
          };

        executiveDashboardCache = cache;
        applyCache(cache);
      } catch (error) {
        console.error(error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="text-xl font-semibold text-slate-500">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const pipelineCards = [
    {
      title: "New Leads",
      value: stats.newLeads || 0,
      icon: Sparkles,
      gradient:
        "from-sky-500 to-blue-600",
    },
    {
      title: "My Leads",
      value: stats.totalLeads || 0,
      icon: Users,
      gradient:
        "from-blue-500 to-indigo-600",
    },
    {
      title: "Contacted",
      value: stats.contacted || 0,
      icon: PhoneCall,
      gradient:
        "from-green-500 to-emerald-600",
    },
    {
      title: "Follow Up",
      value: stats.followUp || 0,
      icon: Clock3,
      gradient:
        "from-orange-500 to-red-500",
    },
    {
      title: "Interested",
      value: stats.interested || 0,
      icon: Heart,
      gradient:
        "from-purple-500 to-pink-500",
    },
    {
      title: "Site Visit Scheduled",
      value:
        stats.siteVisitScheduled || 0,
      icon: MapPin,
      gradient:
        "from-cyan-500 to-blue-500",
    },
    {
      title: "Site Visit Done",
      value: stats.siteVisitDone || 0,
      icon: CheckCircle,
      gradient:
        "from-teal-500 to-emerald-500",
    },
    {
      title: "Won",
      value: stats.won || 0,
      icon: Trophy,
      gradient:
        "from-lime-500 to-green-600",
    },
    {
      title: "Lost",
      value: stats.lost || 0,
      icon: XCircle,
      gradient:
        "from-rose-500 to-pink-600",
    },
  ];

  const leadHealth = [
    {
      name: "Contacted",
      value: stats.contacted || 0,
    },
    {
      name: "Follow Up",
      value: stats.followUp || 0,
    },
    {
      name: "Interested",
      value: stats.interested || 0,
    },
    {
      name: "Won",
      value: stats.won || 0,
    },
  ];

  const temperatureCards = [
    {
      label: "Hot",
      value: stats.hotLeads || 0,
      icon: Flame,
      className:
        "bg-red-50 text-red-700 border-red-100",
    },
    {
      label: "Warm",
      value: stats.warmLeads || 0,
      icon: ThermometerSun,
      className:
        "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      label: "Cold",
      value: stats.coldLeads || 0,
      icon: Snowflake,
      className:
        "bg-blue-50 text-blue-700 border-blue-100",
    },
  ];

  const openLead = (leadId: string) => {
    navigate(`/leads/${leadId}`, {
      state: { from: "/leads/my" },
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-start flex-wrap gap-6">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back
            </h1>

            <p className="text-indigo-100 mt-2 text-lg">
              Your personal sales pipeline
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={() =>
                  navigate("/leads/my")
                }
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition"
              >
                <List size={16} />
                My Leads
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/leads/kanban"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition"
              >
                <Kanban size={16} />
                Kanban Board
              </button>

              <button
                type="button"
                onClick={() =>
                  loadDashboard({
                    force: true,
                  })
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25 transition disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <HeaderStat
              label="Assigned Leads"
              value={stats.totalLeads || 0}
            />

            <HeaderStat
              label="Today's Follow-ups"
              value={todayFollowups}
            />

            <HeaderStat
              label="Today's Schedules"
              value={todaySchedules}
            />

            <HeaderStat
              label="Conversion"
              value={`${stats.conversionRate || 0}%`}
            />

            <HeaderStat
              label="Overdue"
              value={
                stats.overdueFollowups ||
                0
              }
              highlight={
                (stats.overdueFollowups ||
                  0) > 0
              }
            />
          </div>
        </div>
      </div>

      {todayScheduleLeads.length > 0 && (
        <div className="rounded-3xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50 p-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
              <CalendarDays size={24} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                Aaj {todayScheduleLeads.length} schedule hai
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Site visit / meeting aaj ke liye scheduled hain
              </p>

              <div className="mt-4 grid gap-2">
                {todayScheduleLeads
                  .slice(0, 5)
                  .map((lead) => (
                    <button
                      key={lead._id}
                      type="button"
                      onClick={() =>
                        openLead(lead._id)
                      }
                      className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-left hover:bg-white transition"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {lead.fullName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatScheduleStatusLabel(
                            lead.status
                          )}{" "}
                          ·{" "}
                          {formatDisplayDateTime(
                            lead.scheduledDate
                          )}
                        </p>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-slate-400"
                      />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMPERATURE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {temperatureCards.map(
          (item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`rounded-2xl border p-5 ${item.className}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">
                      {item.label}{" "}
                      Leads
                    </p>

                    <h3 className="text-3xl font-bold mt-1">
                      {item.value}
                    </h3>
                  </div>

                  <Icon size={28} />
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* PIPELINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pipelineCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`bg-gradient-to-r ${card.gradient} rounded-3xl p-5 text-white shadow-lg hover:scale-[1.01] transition`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/80 text-xs font-medium">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <Icon size={32} />
              </div>
            </div>
          );
        })}
      </div>

      {/* TODAY SCHEDULES */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              Today&apos;s Schedules
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Site visit / office / virtual meeting scheduled for today
            </p>
          </div>

          <span className="rounded-full bg-cyan-100 text-cyan-700 px-3 py-1 text-sm font-semibold">
            {todaySchedules}
          </span>
        </div>

        {todayScheduleLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No schedules for today.
          </div>
        ) : (
          <div className="divide-y">
            {todayScheduleLeads.map((lead) => (
              <button
                key={lead._id}
                type="button"
                onClick={() =>
                  openLead(lead._id)
                }
                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {lead.fullName}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {lead.phone || "No phone"}
                  </p>

                  <p className="text-xs text-cyan-700 mt-2 font-medium">
                    {formatDisplayDateTime(
                      lead.scheduledDate
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <StatusBadge
                    status={lead.status}
                  />

                  <ArrowRight
                    size={16}
                    className="text-slate-400"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TODAY FOLLOWUPS */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              Today&apos;s Follow-ups
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Leads scheduled for follow-up today
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-sm font-semibold">
            {todayFollowups}
          </span>
        </div>

        {todayLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No follow-ups scheduled for today.
          </div>
        ) : (
          <div className="divide-y">
            {todayLeads.map((lead) => (
              <button
                key={lead._id}
                type="button"
                onClick={() =>
                  openLead(lead._id)
                }
                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {lead.fullName}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {lead.phone || "No phone"}
                  </p>

                  {lead.followUpDate && (
                    <p className="text-xs text-indigo-600 mt-2 font-medium">
                      {formatDisplayDateTime(
                        lead.followUpDate
                      )}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {lead.temperature && (
                    <TemperatureBadge
                      temperature={
                        lead.temperature
                      }
                    />
                  )}

                  <StatusBadge
                    status={lead.status}
                  />

                  <ArrowRight
                    size={16}
                    className="text-slate-400"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="text-xl font-bold mb-1">
            Daily Activity
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Your lead updates in the last 7 days
          </p>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={activityData}
              >
                <defs>
                  <linearGradient
                    id="activityFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#6366f1"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6366f1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="activities"
                  stroke="#6366f1"
                  fill="url(#activityFill)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="text-xl font-bold mb-1">
            Lead Health
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Active pipeline breakdown
          </p>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={leadHealth}
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                >
                  {PIPELINE_COLORS.map(
                    (color) => (
                      <Cell
                        key={color}
                        fill={color}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {leadHealth.map(
              (item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        PIPELINE_COLORS[
                          index
                        ],
                    }}
                  />

                  <span className="text-sm">
                    {item.name} (
                    {item.value})
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-1">
            Monthly Performance
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Assigned leads vs won deals
          </p>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="assigned"
                  name="Assigned"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                />

                <Bar
                  dataKey="won"
                  name="Won"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Recent Follow-ups
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest leads in follow-up status
              </p>
            </div>

            {(stats.overdueFollowups ||
              0) > 0 && (
              <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-semibold">
                <AlertCircle size={14} />
                {stats.overdueFollowups}{" "}
                overdue
              </div>
            )}
          </div>

          {followups.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No follow-ups found
            </div>
          ) : (
            <div className="divide-y">
              {followups.map((lead) => (
                <button
                  key={lead._id}
                  type="button"
                  onClick={() =>
                    openLead(lead._id)
                  }
                  className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {lead.fullName}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {lead.followUpDate
                        ? new Date(
                            lead.followUpDate
                          ).toLocaleDateString()
                        : "No date set"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={
                        lead.status
                      }
                    />

                    <ArrowRight
                      size={16}
                      className="text-slate-400"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-5 py-4 backdrop-blur ${
        highlight
          ? "bg-amber-400/20 ring-1 ring-amber-200/40"
          : "bg-white/10"
      }`}
    >
      <p className="text-sm">{label}</p>

      <h3 className="text-2xl font-bold mt-1">
        {value}
      </h3>
    </div>
  );
}
