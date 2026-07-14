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
  employeeId?: string;
  employeeName: string;
  role?: string;
  assignedLeads: number;
  pendingLeads?: number;
  wonLeads?: number;
  totalCalls?: number;
  statusUpdates?: number;
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

export interface ExecutiveDashboardStats {
  totalLeads: number;
  newLeads: number;
  contacted: number;
  followUp: number;
  interested: number;
  siteVisitScheduled: number;
  siteVisitDone: number;
  won: number;
  lost: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  overdueFollowups: number;
  todaySchedules?: number;
  conversionRate: number;
}

export interface ExecutiveScheduleLead {
  _id: string;
  fullName: string;
  phone?: string;
  status: string;
  scheduledDate?: string;
  temperature?: string;
}

export interface ExecutiveFollowupLead {
  _id: string;
  fullName: string;
  phone?: string;
  status: string;
  followUpDate?: string;
  scheduledDate?: string;
  temperature?: string;
  lastWorkedAt?: string;
  updatedAt?: string;
}

export interface DailyActivityPoint {
  day: string;
  date: string;
  activities: number;
}

export interface MonthlyTrendPoint {
  month: string;
  assigned: number;
  won: number;
}