import { useEffect, useState } from "react";
import {
    Users,
    PhoneCall,
    Clock3,
    Heart,
    MapPin,
    CheckCircle,
    Trophy,
    XCircle,
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
} from "recharts";

import {
    getMyDashboard,
    getMyRecentFollowups,
    getMyTrend,
    getTodayFollowups,
} from "../../api/dashboardApi";

export default function ExecutiveDashboard() {
    const [stats, setStats] = useState<any>(null);

    const [followups, setFollowups] =
        useState<any[]>([]);

    const [trendData, setTrendData] =
        useState<any[]>([]);

    const [todayFollowups, setTodayFollowups] =
        useState(0);
    useEffect(() => {
        loadDashboard();
    }, []);
    const loadDashboard = async () => {
        try {
            const [
                dashboardRes,
                followupRes,
                trendRes,
                todayRes,
            ] = await Promise.all([
                getMyDashboard(),
                getMyRecentFollowups(),
                getMyTrend(),
                getTodayFollowups(),
            ]);
            setStats(dashboardRes);

            setFollowups(
                followupRes.leads || []
            );

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

            setTrendData(
  (trendRes?.trend || []).map((item: any) => ({
    month: monthNames[item._id?.month - 1] || "",
    count: item.leads || 0,
  }))
);

            setTodayFollowups(
                todayRes.count || 0
            );
        } catch (error) {
            console.error(error);
        }
    };

    if (!stats) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="text-xl font-semibold text-slate-500">
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: "My Leads",
            value: stats.totalLeads || 0,
            icon: Users,
            gradient: "from-blue-500 to-indigo-600",
        },
        {
            title: "Contacted",
            value: stats.contacted || 0,
            icon: PhoneCall,
            gradient: "from-green-500 to-emerald-600",
        },
        {
            title: "Follow Up",
            value: stats.followUp || 0,
            icon: Clock3,
            gradient: "from-orange-500 to-red-500",
        },
        {
            title: "Interested",
            value: stats.interested || 0,
            icon: Heart,
            gradient: "from-purple-500 to-pink-500",
        },
        {
            title: "Site Visit Scheduled",
            value: stats.siteVisitScheduled || 0,
            icon: MapPin,
            gradient: "from-cyan-500 to-blue-500",
        },
        {
            title: "Site Visit Done",
            value: stats.siteVisitDone || 0,
            icon: CheckCircle,
            gradient: "from-teal-500 to-emerald-500",
        },
        {
            title: "Won",
            value: stats.won || 0,
            icon: Trophy,
            gradient: "from-lime-500 to-green-600",
        },
        {
            title: "Lost",
            value: stats.lost || 0,
            icon: XCircle,
            gradient: "from-rose-500 to-pink-600",
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

    const weeklyData = [
        { day: "Mon", leads: 12 },
        { day: "Tue", leads: 18 },
        { day: "Wed", leads: 10 },
        { day: "Thu", leads: 22 },
        { day: "Fri", leads: 17 },
        { day: "Sat", leads: 29 },
        { day: "Sun", leads: 19 },
    ];

    const COLORS = [
        "#4f46e5",
        "#8b5cf6",
        "#ec4899",
        "#10b981",
    ];

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-center flex-wrap gap-6">

                    <div>
                        <h1 className="text-4xl font-bold">
                            Welcome Back 👋
                        </h1>

                        <p className="text-indigo-100 mt-2 text-lg">
                            Track your daily performance
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4">
                            <p className="text-sm">Assigned Leads</p>
                            <h3 className="text-3xl font-bold">
                                {stats.totalLeads || 0}
                            </h3>
                        </div>

                        <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4">
                            <p className="text-sm">
                                Today Followups
                            </p>

                            <h3 className="text-3xl font-bold">
                                {todayFollowups}
                            </h3>

                        </div>

                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className={`bg-gradient-to-r ${card.gradient} rounded-3xl p-6 text-white shadow-lg hover:scale-[1.02] transition`}
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

                                <Icon size={36} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CHARTS */}
            {/* CHARTS ROW 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* DAILY ACTIVITY */}
                <div className="bg-white rounded-3xl p-5 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">
                        Daily Activity Trend
                    </h2>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyData}>
                                <defs>
                                    <linearGradient
                                        id="leadFill"
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
                                <YAxis />
                                <Tooltip />

                                <Area
                                    type="monotone"
                                    dataKey="leads"
                                    stroke="#6366f1"
                                    fill="url(#leadFill)"
                                    strokeWidth={4}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* LEAD HEALTH */}
                <div className="bg-white rounded-3xl p-5 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">
                        Lead Health
                    </h2>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={leadHealth}
                                    innerRadius={80}
                                    outerRadius={120}
                                    dataKey="value"
                                >
                                    <Cell fill="#4f46e5" />
                                    <Cell fill="#f97316" />
                                    <Cell fill="#ec4899" />
                                    <Cell fill="#22c55e" />
                                </Pie>

                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
  {leadHealth.map(
    (item: any, index: number) => (
      <div
        key={item.name}
        className="flex items-center gap-2"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor:
              COLORS[index],
          }}
        />

        <span className="text-sm">
          {item.name} ({item.value})
        </span>
      </div>
    )
  )}
</div>
                </div>

            </div>

            {/* CHARTS ROW 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* MONTHLY CONVERSION */}
                <div className="bg-white rounded-3xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">
                        Monthly Conversion Trend
                    </h2>

                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={trendData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />

                                <Bar
                                    dataKey="count"
                                    fill="#8b5cf6"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RECENT FOLLOWUPS */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">
                            Recent Followups
                        </h2>
                    </div>

                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4">
                                    Lead
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Follow Up
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {followups.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="p-4 text-center text-slate-500"
                                    >
                                        No followups found
                                    </td>
                                </tr>
                            ) : (
                                followups.map((lead: any) => (
                                    <tr
                                        key={lead._id}
                                        className="border-t"
                                    >
                                        <td className="p-4">
                                            {lead.fullName}
                                        </td>

                                        <td className="p-4">
                                            {lead.status}
                                        </td>

                                        <td className="p-4">
                                            {lead.followUpDate
                                                ? new Date(
                                                    lead.followUpDate
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>

            </div>

        </div>
    );
}