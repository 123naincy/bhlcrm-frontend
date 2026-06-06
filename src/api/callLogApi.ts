import api from "./axios";

export const getLeadRecordings = async (
  leadId: string
) => {
  const response = await api.get(
    `/call-logs/lead/${leadId}`
  );

  return response.data;
};

export const playRecording = async (
  callLogId: string
) => {
  const response = await api.get(
    `/call-logs/${callLogId}/play`
  );

  return response.data;
};