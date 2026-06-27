import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

import {
  Flame,
  Trophy,
  Clock3,
  Users,
  Target,
  Building2,
  Phone,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

import {
  getDashboardStats,
  getSourcePerformance,
  getTeamPerformance,
} from "../../api/dashboardApi";
import ExecutiveDashboard from "./ExecutiveDashboard";

const COLORS = [
  "#4F46E5",
  "#7C3AED",
  "#F59E0B",
  "#10B981",
  "#EC4899",
];

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-white/80">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            {value.toLocaleString()}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-white/70">
              {subtitle}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {icon}

            <h2 className="text-base font-semibold text-slate-900">
              {title}
            </h2>
          </div>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [topPerformer, setTopPerformer] =
    useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user?.role;

  useEffect(() => {
    if (
      role === "sales_executive" ||
      role === "telecaller"
    ) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [statsRes, sourceRes, teamRes] =
          await Promise.all([
            getDashboardStats(),
            getSourcePerformance(),
            getTeamPerformance(),
          ]);

        setStats(statsRes);

        setSources(
          sourceRes.sourcePerformance ||
            sourceRes.performance?.map(
              (row: any) => ({
                _id: row.source,
                count: row.totalLeads,
              })
            ) ||
            []
        );

        setTeam(
          teamRes.performance
            ?.filter(
              (row: any) =>
                row.role ===
                "sales_executive"
            )
            .map((row: any) => ({
              name: row.employeeName,
              role: row.role,
              assignedLeads:
                row.assignedLeads || 0,
              wonLeads:
                row.wonLeads || 0,
              hotLeads:
                row.hotLeads || 0,
              followUpUpdates:
                row.followUpUpdates || 0,
            }))
            .sort(
              (a: any, b: any) =>
                b.assignedLeads -
                a.assignedLeads
            ) || []
        );

        const performance =
          teamRes.performance || [];

        const apiTop =
          teamRes.topPerformer;

        const fallbackTop = performance
          .filter(
            (row: any) =>
              row.role ===
                "sales_executive" ||
              row.role === "telecaller"
          )
          .sort(
            (a: any, b: any) =>
              (b.followUpUpdates || 0) -
                (a.followUpUpdates || 0) ||
              (b.workedLeads || 0) -
                (a.workedLeads || 0)
          )[0];

        setTopPerformer(
          apiTop ||
            (fallbackTop
              ? {
                  employeeName:
                    fallbackTop.employeeName,
                  role: fallbackTop.role,
                  followUpUpdates:
                    fallbackTop.followUpUpdates ||
                    0,
                }
              : null)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [role]);

  const funnelData = [
    {
      value: stats?.totalLeads || 0,
      name: "Total",
      fill: "#6366F1",
    },
    {
      value: stats?.contactedLeads || 0,
      name: "Contacted",
      fill: "#8B5CF6",
    },
    {
      value: stats?.followUpLeads || 0,
      name: "Follow Up",
      fill: "#F59E0B",
    },
    {
      value: stats?.wonLeads || 0,
      name: "Won",
      fill: "#10B981",
    },
  ];

  const healthData = [
    {
      name: "Hot",
      value: stats?.hotLeads || 0,
      color: "bg-red-500",
      text: "text-red-600",
      bg: "bg-red-50",
    },
    {
      name: "Warm",
      value: stats?.warmLeads || 0,
      color: "bg-amber-500",
      text: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      name: "Cold",
      value: stats?.coldLeads || 0,
      color: "bg-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  const totalHealth =
    healthData.reduce(
      (sum, item) => sum + item.value,
      0
    ) || 1;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-500 shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (
    role === "sales_executive" ||
    role === "telecaller"
  ) {
    return <ExecutiveDashboard />;
  }

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100">
              <Sparkles size={14} />
              Admin Overview
            </div>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              CRM Dashboard
            </h1>

            <p className="mt-2 text-sm text-indigo-100/90">
              {today} · Track leads, team activity, and conversions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Today Updates",
                value:
                  stats?.todayStatusUpdates ??
                  stats?.todayLeads ??
                  0,
              },
              {
                label: "Pending",
                value:
                  stats?.pendingLeads ??
                  stats?.pendingAssignedLeads ??
                  0,
              },
              {
                label: "Lost",
                value: stats?.lostLeads || 0,
              },
              {
                label: "Won",
                value: stats?.wonLeads || 0,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-xs text-indigo-100/80">
                  {item.label}
                </p>

                <p className="mt-1 text-xl font-bold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          subtitle="All active pipeline"
          icon={<Users size={22} />}
          gradient="bg-gradient-to-br from-blue-600 to-indigo-700"
        />

        <StatCard
          title="Hot Leads"
          value={stats?.hotLeads || 0}
          subtitle="High priority"
          icon={<Flame size={22} />}
          gradient="bg-gradient-to-br from-red-500 to-orange-500"
        />

        <StatCard
          title="Won Deals"
          value={stats?.wonLeads || 0}
          subtitle="Closed successfully"
          icon={<Trophy size={22} />}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Follow Ups"
          value={stats?.followUpLeads || 0}
          subtitle="Needs attention"
          icon={<Clock3 size={22} />}
          gradient="bg-gradient-to-br from-purple-600 to-fuchsia-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel
          title="Lead Funnel"
          subtitle="From total to won"
          className="xl:col-span-4"
        >
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart>
              <Tooltip />

              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList
                  position="right"
                  fill="#334155"
                  stroke="none"
                  dataKey="name"
                  fontSize={12}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Source Performance"
          subtitle="Leads by source"
          icon={
            <Building2
              className="text-indigo-600"
              size={18}
            />
          }
          className="xl:col-span-4"
        >
          {sources.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="count"
                  nameKey="_id"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {sources.map(
                    (_: any, index: number) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">
              No source data
            </div>
          )}
        </Panel>

        <Panel
          title="Lead Temperature"
          subtitle="Hot, warm & cold split"
          className="xl:col-span-4"
        >
          <div className="space-y-4">
            {healthData.map((item) => {
              const pct = Math.round(
                (item.value / totalHealth) *
                  100
              );

              return (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {item.name}
                    </span>

                    <span
                      className={`font-semibold ${item.text}`}
                    >
                      {item.value}
                      {" "}
                      <span className="text-slate-400">
                        ({pct}%)
                      </span>
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${pct}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {healthData.map((item) => (
              <div
                key={item.name}
                className={`rounded-xl p-3 text-center ${item.bg}`}
              >
                <p className="text-xs text-slate-500">
                  {item.name}
                </p>

                <p
                  className={`mt-1 text-lg font-bold ${item.text}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Team section */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Top Performer */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-xl xl:col-span-4">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={20} />

              <h2 className="text-lg font-semibold">
                Top Performer
              </h2>
            </div>

            {topPerformer ? (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
                  {topPerformer.employeeName?.charAt(
                    0
                  )}
                </div>

                <h3 className="text-xl font-bold">
                  {
                    topPerformer.employeeName
                  }
                </h3>

                <p className="mt-1 text-sm capitalize text-white/85">
                  {topPerformer.role?.replace(
                    "_",
                    " "
                  )}
                </p>

                <div className="mt-5 rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/80">
                    Follow-up Updates
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {
                      topPerformer.followUpUpdates
                    }
                  </p>

                  <p className="mt-1 text-xs text-white/70">
                    {topPerformer.followUpUpdates > 0
                      ? "Most active on follow-ups"
                      : "No follow-up logs yet — updates will appear here"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-white/80">
                No follow-up activity yet
              </p>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <Panel
          title="Sales Executive Leaderboard"
          subtitle="Ranked by assigned leads"
          icon={
            <Target
              className="text-indigo-600"
              size={18}
            />
          }
          className="xl:col-span-8"
        >
          {team.length ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                {team.map((member, index) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
                          ? "bg-amber-100 text-amber-700"
                          : index === 1
                          ? "bg-slate-200 text-slate-700"
                          : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">
                        {member.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {member.wonLeads}
                        {" "}
                        won ·
                        {" "}
                        {member.hotLeads}
                        {" "}
                        hot
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {
                          member.assignedLeads
                        }
                      </p>

                      <p className="text-xs text-slate-500">
                        leads
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <ResponsiveContainer width="100%" height={Math.max(team.length * 56, 240)}>
                <BarChart
                  data={team}
                  layout="vertical"
                  margin={{
                    left: 8,
                    right: 16,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis type="number" />

                  <YAxis
                    dataKey="name"
                    type="category"
                    width={90}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      value,
                      "Assigned Leads",
                    ]}
                  />

                  <Bar
                    dataKey="assignedLeads"
                    fill="#6366F1"
                    radius={[0, 10, 10, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
              No sales executive data available
            </div>
          )}
        </Panel>
      </div>

      {/* Quick status row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Contacted",
            value: stats?.contactedLeads || 0,
            icon: <Phone size={18} />,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Won",
            value: stats?.wonLeads || 0,
            icon: (
              <CheckCircle2 size={18} />
            ),
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Lost",
            value: stats?.lostLeads || 0,
            icon: <XCircle size={18} />,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={`rounded-xl p-3 ${item.bg} ${item.color}`}
            >
              {item.icon}
            </div>

            <div>
              <p className="text-sm text-slate-500">
                {item.label}
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
