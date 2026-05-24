import { useEffect, useState } from "react";
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
  Users,
  Flame,
  Trophy,
  XCircle,
  TrendingUp,
  Building2,
  Target,
} from "lucide-react";

function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsRes, teamRes, sourceRes] =
        await Promise.all([
          getDashboardStats(),
          getTeamPerformance(),
          getSourcePerformance(),
        ]);

      setStats(statsRes);
      setTeamData(
        teamRes.teamPerformance ||
          teamRes.performance?.map((row: any) => ({
            name: row.employeeName,
            leadCount: row.assignedLeads,
          })) ||
          []
      );
      setSourceData(
        sourceRes.sourcePerformance ||
          sourceRes.performance ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

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

      {/* MAIN CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* SOURCE */}
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

          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#4f46e5"
                radius={[14, 14, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TEAM */}
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
                Executive productivity
              </p>
            </div>
          </div>

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
        </div>
      </div>

      {/* PIE */}
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