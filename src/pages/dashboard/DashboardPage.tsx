import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  LabelList,
  BarChart,
  Bar,
} from "recharts";

import {
  Flame,
  Trophy,
  Clock3,
  Users,
  TrendingUp,
  Target,
  Building2,
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

function Card({ title, value, icon, gradient }: any) {
  return (
    <div
      className={`rounded-lg p-4 text-white shadow-md ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-xs">{title}</p>
          <h2 className="text-xl font-semibold mt-1">{value}</h2>
        </div>

        <div className="bg-white/20 p-2.5 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
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
      const statsRes =
        await getDashboardStats();

      const sourceRes =
        await getSourcePerformance();

      const teamRes =
        await getTeamPerformance();

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
        teamRes.performance?.map(
          (row: any) => ({
            name: row.employeeName,
            leadCount:
              row.assignedLeads,
          })
        ) || []
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
      name: "New Leads",
    },
    {
      value: stats?.contactedLeads || 0,
      name: "Contacted",
    },
    {
      value: stats?.followUpLeads || 0,
      name: "Follow Up",
    },
    {
      value: stats?.wonLeads || 0,
      name: "Won",
    },
  ];

  const trendData = [
    { day: "Mon", leads: 12 },
    { day: "Tue", leads: 18 },
    { day: "Wed", leads: 9 },
    { day: "Thu", leads: 22 },
    { day: "Fri", leads: 17 },
    { day: "Sat", leads: 28 },
    { day: "Sun", leads: 19 },
  ];

  const healthData = [
    {
      name: "Hot",
      value: stats?.hotLeads || 0,
      fill: "#EF4444",
    },
    {
      name: "Warm",
      value: stats?.warmLeads || 0,
      fill: "#F59E0B",
    },
    {
      name: "Cold",
      value: stats?.coldLeads || 0,
      fill: "#3B82F6",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
        Loading dashboard...
      </div>
    );
  }
if (
  role === "sales_executive" ||
  role === "telecaller"
) {
  return <ExecutiveDashboard />;
}
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-lg p-5 text-white shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              CRM Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Performance overview
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon={<Users size={20} />}
          gradient="bg-gradient-to-r from-blue-600 to-indigo-700"
        />

        <Card
          title="Hot Leads"
          value={stats?.hotLeads || 0}
          icon={<Flame size={20} />}
          gradient="bg-gradient-to-r from-red-500 to-orange-500"
        />

        <Card
          title="Won Deals"
          value={stats?.wonLeads || 0}
          icon={<Trophy size={20} />}
          gradient="bg-gradient-to-r from-emerald-500 to-green-600"
        />

        <Card
          title="Pending Followups"
          value={stats?.followUpLeads || 0}
          icon={<Clock3 size={20} />}
          gradient="bg-gradient-to-r from-purple-600 to-fuchsia-600"
        />
      </div>

      {/* TOP CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <h2 className="text-sm font-semibold mb-4">
            Lead Funnel
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <FunnelChart>
              <Tooltip />

              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList
                  position="right"
                  fill="#111827"
                  stroke="none"
                  dataKey="name"
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* TREND */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">
              Weekly Lead Trend
            </h2>

            <TrendingUp className="text-indigo-600" />
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient
                  id="colorLeads"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#6366F1"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#6366F1"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="leads"
                stroke="#6366F1"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorLeads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MID SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* SOURCE */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-indigo-600" size={18} />
            <h2 className="text-sm font-semibold">
              Source Performance
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sources}
                dataKey="count"
                nameKey="_id"
                innerRadius={70}
                outerRadius={110}
              >
                {sources.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* HEALTH */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <h2 className="text-sm font-semibold mb-4">
            Lead Health
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="20%"
              outerRadius="90%"
              data={healthData}
            >
              <RadialBar dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* TOP PERFORMER */}
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white rounded-lg p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-4">
            Top Performer
          </h2>

          {team.length > 0 ? (
            <>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold mb-3">
                {team[0]?.name?.charAt(0)}
              </div>

              <h3 className="text-base font-semibold">
                {team[0]?.name}
              </h3>

              <p className="mt-4">
                Assigned Leads: {team[0]?.leadCount || 0}
              </p>
            </>
          ) : (
            <p>No performance data</p>
          )}
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Target className="text-indigo-600" />
          Team Leaderboard
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={team} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />

            <Bar
              dataKey="leadCount"
              fill="#7C3AED"
              radius={[0, 12, 12, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}