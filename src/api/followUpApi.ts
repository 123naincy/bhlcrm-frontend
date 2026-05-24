import api from "./axios";

export const createFollowUp = async (data: any) => {
  const response = await api.post("/followups", data);
  return response.data;
};

export const getLeadFollowUps = async (
  leadId: string
) => {
  const response = await api.get(
    `/followups/${leadId}`
  );
  return response.data;
};

export const updateFollowUp = async (
  id: string,
  data: any
) => {
  const response = await api.patch(
    `/followups/${id}`,
    data
  );
  return response.data;
};

export const deleteFollowUp = async (
  id: string
) => {
  const response = await api.delete(
    `/followups/${id}`
  );
  return response.data;
};