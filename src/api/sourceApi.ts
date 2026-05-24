import api from "./axios";

export const getSourceMappings =
  async () => {
    const response =
      await api.get(
        "/source-mappings"
      );

    return response.data;
  };

export const createSourceMapping =
  async (data: any) => {
    const response =
      await api.post(
        "/source-mappings",
        data
      );

    return response.data;
  };

export const deleteSourceMapping =
  async (id: string) => {
    const response =
      await api.delete(
        `/source-mappings/${id}`
      );

    return response.data;
  };