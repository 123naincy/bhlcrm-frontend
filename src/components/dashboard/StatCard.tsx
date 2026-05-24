
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2 text-slate-900">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;