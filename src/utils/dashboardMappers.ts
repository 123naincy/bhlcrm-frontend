export function mapSourcePerformanceRows(
  sourceRes: any
) {
  const rows =
    sourceRes?.sourcePerformance ||
    sourceRes?.performance ||
    [];

  return rows.map((row: any) => ({
    _id:
      row._id ||
      row.source ||
      "Unknown",
    name:
      row.source ||
      row._id ||
      "Unknown",
    count:
      row.count ??
      row.totalLeads ??
      0,
    totalLeads:
      row.totalLeads ??
      row.count ??
      0,
    hotLeads: row.hotLeads || 0,
    wonLeads: row.wonLeads || 0,
  }));
}

export function mapTeamPerformanceRows(
  teamRes: any
) {
  const rows = teamRes?.performance || [];

  return rows
    .filter(
      (row: any) =>
        row.role ===
          "sales_executive" ||
        row.role === "telecaller"
    )
    .map((row: any) => ({
      name: row.employeeName,
      role: row.role,
      leadCount:
        row.assignedLeads || 0,
      assignedLeads:
        row.assignedLeads || 0,
      pendingLeads:
        row.pendingLeads || 0,
      totalCalls:
        row.totalCalls || 0,
      statusUpdates:
        row.statusUpdates || 0,
      wonLeads: row.wonLeads || 0,
    }));
}
