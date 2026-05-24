export function TimelineItem({ activity }: any) {
  return (
    <div className="flex gap-4 pb-6">
      <div className="w-3 h-3 rounded-full bg-indigo-600 mt-2" />
      <div>
        <h4 className="font-semibold text-slate-900">{activity.actionType}</h4>
        <p className="text-slate-500 text-sm">{activity.note}</p>
        <p className="text-xs text-slate-400 mt-1">
          {new Date(activity.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}