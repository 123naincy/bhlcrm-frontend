import api from "./axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getTeamPerformance = async () => {
  const response = await api.get("/dashboard/team-performance");
  return response.data;
};

export const getSourcePerformance = async () => {
  const response = await api.get("/dashboard/source-performance");
  return response.data;
};
export const getMyDashboard = async () => {
  const response = await api.get(
    "/dashboard/my-dashboard"
  );
  return response.data;
};
export const getMyRecentFollowups =
  async () => {
    const response =
      await api.get(
        "/dashboard/my-followups"
      );

    return response.data;
  };

export const getMyTrend =
  async () => {
    const response =
      await api.get(
        "/dashboard/my-trend"
      );

    return response.data;
  };

export const getTodayFollowups =
  async () => {
    const response =
      await api.get(
        "/dashboard/today-followups"
      );

    return response.data;
  };

export const getMyDailyActivity =
  async () => {
    const response =
      await api.get(
        "/dashboard/my-daily-activity"
      );

    return response.data;
  };

  export const getManagerSummary =
  async () => {
    const response =
      await api.get(
        "/dashboard/manager-summary"
      );

    return response.data;
  };