import { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import {
  getDashboardStats,
  getTeamPerformance,
  getSourcePerformance,
} from "../../api/dashboardApi";

import {
  mapSourcePerformanceRows,
  mapTeamPerformanceRows,
} from "../../utils/dashboardMappers";

import {
  Users,
  Flame,
  Trophy,
  XCircle,
  Building2,
  Target,
  RefreshCw,
} from "lucide-react";

function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setRefreshing(true);
      setError("");

      const [statsRes, teamRes, sourceRes] =
        await Promise.allSettled([
          getDashboardStats(),
          getTeamPerformance(),
          getSourcePerformance(),
        ]);

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      } else {
        console.error(
          "Analytics stats failed:",
          statsRes.reason
        );
      }

      if (teamRes.status === "fulfilled") {
        setTeamData(
          mapTeamPerformanceRows(
            teamRes.value
          )
        );
      } else {
        console.error(
          "Analytics team failed:",
          teamRes.reason
        );
      }

      if (sourceRes.status === "fulfilled") {
        setSourceData(
          mapSourcePerformanceRows(
            sourceRes.value
          )
        );
      } else {
        console.error(
          "Analytics source failed:",
          sourceRes.reason
        );
      }

      if (
        statsRes.status === "rejected" &&
        teamRes.status === "rejected" &&
        sourceRes.status === "rejected"
      ) {
        setError(
          "Failed to load analytics data."
        );
      }
    } catch (loadError) {
      console.error(loadError);
      setError(
        "Failed to load analytics data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
        Loading analytics...
      </div>
    );
  }

  const pieData = [
    {
      name: "Won",
      value: stats?.wonLeads || 0,
    },
    {
      name: "Lost",
      value: stats?.lostLeads || 0,
    },
    {
      name: "Hot",
      value: stats?.hotLeads || 0,
    },
  ];

  const PIE_COLORS = [
    "#22c55e",
    "#ef4444",
    "#f97316",
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-lg p-5 text-white shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">Analytics</h1>
            <p className="text-slate-300 text-sm mt-1">
              Business performance metrics
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadAnalytics()}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm disabled:opacity-60"
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-4 text-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-xs">Total Leads</p>
              <h2 className="text-xl font-semibold mt-1">
                {stats?.totalLeads || 0}
              </h2>
            </div>
            <Users size={22} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-4 text-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-xs">Hot Leads</p>
              <h2 className="text-xl font-semibold mt-1">
                {stats?.hotLeads || 0}
              </h2>
            </div>
            <Flame size={22} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-xs">Won Deals</p>
              <h2 className="text-xl font-semibold mt-1">
                {stats?.wonLeads || 0}
              </h2>
            </div>
            <Trophy size={22} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-red-700 rounded-lg p-4 text-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-rose-100 text-xs">Lost Leads</p>
              <h2 className="text-xl font-semibold mt-1">
                {stats?.lostLeads || 0}
              </h2>
            </div>
            <XCircle size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Building2 className="text-indigo-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Lead Source Performance
              </h2>
              <p className="text-slate-500">
                Channel-wise lead generation
              </p>
            </div>
          </div>

          {sourceData.length ? (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#4f46e5"
                  radius={[14, 14, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[380px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
              No source data available
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-white/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Target className="text-emerald-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Team Performance
              </h2>
              <p className="text-slate-500">
                Total leads, pending without status change, and updates today
              </p>
            </div>
          </div>

          {teamData.length ? (
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart data={teamData}>
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
                      stopColor="#10b981"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="leadCount"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorLeads)"
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[380px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
              No team performance data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl p-10 border border-white/50">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Deal Distribution
        </h2>

        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={160}
              innerRadius={90}
              paddingAngle={8}
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={PIE_COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsPage;
