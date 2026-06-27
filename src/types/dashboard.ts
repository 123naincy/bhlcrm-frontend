export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  wonLeads: number;
  lostLeads: number;
  todayLeads: number;
  todayStatusUpdates?: number;
  todayNewLeads?: number;
  pendingFollowups: number;
  pendingLeads?: number;
  pendingAssignedLeads?: number;
}

export interface TeamPerformance {
  employeeName: string;
  assignedLeads: number;
  hotLeads: number;
  wonLeads: number;
  followUpUpdates?: number;
}

export interface TopPerformer {
  employeeId: string;
  employeeName: string;
  role: string;
  followUpUpdates: number;
}

export interface SourcePerformance {
  source: string;
  totalLeads: number;
  hotLeads: number;
  wonLeads: number;
}