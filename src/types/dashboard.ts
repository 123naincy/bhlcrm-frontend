export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  wonLeads: number;
  lostLeads: number;
  todayLeads: number;
  pendingFollowups: number;
}

export interface TeamPerformance {
  employeeName: string;
  assignedLeads: number;
  hotLeads: number;
  wonLeads: number;
}

export interface SourcePerformance {
  source: string;
  totalLeads: number;
  hotLeads: number;
  wonLeads: number;
}