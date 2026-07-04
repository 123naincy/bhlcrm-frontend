import api from "./axios";

export const getLeads = async () => {
  const response = await api.get("/leads");
  return response.data;
};

export const filterLeads = async (
  query: string
) => {
  const response = await api.get(
    `/leads/filter?${query}`
  );
  return response.data;
};

export const getLeadTimeline = async (
  leadId: string
) => {
  const response = await api.get(
    `/leads/timeline/${leadId}`
  );
  return response.data;
};

export const updateLead = async (
  leadId: string,
  data: any
) => {
  const response = await api.put(
    `/leads/update/${leadId}`,
    data
  );
  return response.data;
};

export const reassignLead = async (
  leadId: string,
  employeeId: string
) => {
  const response = await api.put(
    `/leads/reassign/${leadId}`,
    {
      newEmployeeId: employeeId,
    }
  );

  return response.data;
};

export const getSingleLead = async (
  leadId: string
) => {
  const response = await api.get(
    `/leads/single/${leadId}`
  );

  return response.data;
};

export const createLead = async (
  data: any
) => {
  const response = await api.post(
    "/leads/create",
    data
  );

  return response.data;
};

export const getKanbanLeads = async (
  params: any
) => {
  const query =
    new URLSearchParams();

  Object.keys(params).forEach(
    (key) => {
      if (params[key]) {
        query.append(
          key,
          params[key]
        );
      }
    }
  );

  const response = await api.get(
    `/leads/kanban?${query.toString()}`
  );

  return response.data;
};

export const exportLeads = async (
  params: any = {}
) => {
  const query =
    new URLSearchParams();

  Object.keys(params).forEach(
    (key) => {
      if (params[key]) {
        query.append(
          key,
          params[key]
        );
      }
    }
  );

  const response = await api.get(
    `/leads/export?${query.toString()}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const importLeads = async (
  file: File,
  projectName?: string
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (projectName) {
    formData.append(
      "projectName",
      projectName
    );
  }

  const response =
    await api.post(
      "/leads/import",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
};
export const getAllLeads = async (
  params: any = {}
) => {
  const response = await api.get(
    "/leads/all",
    {
      params,
    }
  );

  return response.data;
};
  export const getAssignedLeads =
  async (
    params: any = {}
  ) => {
    const response =
      await api.get(
        "/leads/assigned",
        {
          params,
        }
      );

    return response.data;
  };
  export const getMyLeads =
  async (
    params: any = {}
  ) => {
    const response =
      await api.get(
        "/leads/my",
        {
          params,
        }
      );

    return response.data;
  };
  export const bulkAssignLeads =
  async (
    leadIds: string[],
    assignedTo: string
  ) => {
    const response =
      await api.put(
        "/leads/bulk-assign",
        {
          leadIds,
          assignedTo,
        }
      );

    return response.data;
  };
  export const getLeadById =
  async (id: string) => {
    const response =
      await api.get(
        `/leads/${id}`
      );

    return response.data;
  };
  export const updateLeadStatus =
  async (
    id: string,
    status: string
  ) => {
    const response =
      await api.put(
        `/leads/${id}/status`,
        { status }
      );

    return response.data;
  };

export const addLeadNote =
  async (
    id: string,
    note: string
  ) => {
    const response =
      await api.put(
        `/leads/${id}/note`,
        { note }
      );

    return response.data;
  };

export const deleteLead = async (id: string) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};