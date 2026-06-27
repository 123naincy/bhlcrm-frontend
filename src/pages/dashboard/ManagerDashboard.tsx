import {
  useEffect,
  useState,
} from "react";

import {
  getManagerSummary,
} from "../../api/dashboardApi";

export default function ManagerDashboard() {
  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      const res =
        await getManagerSummary();

      setData(res);
    };

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card
        title="Total Team Leads"
        value={
          data?.totalTeamLeads || 0
        }
      />

      <Card
        title="Worked Today"
        value={
          data?.workedToday || 0
        }
      />

      <Card
        title="Followups Today"
        value={
          data?.followupsToday || 0
        }
      />

      <Card
        title="Interested Leads"
        value={
          data?.interestedLeads || 0
        }
      />
    </div>
  );
}

function Card({
  title,
  value,
}: any) {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}