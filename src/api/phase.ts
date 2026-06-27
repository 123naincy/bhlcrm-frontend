import api from "./axios";
import type { Phase } from "../types/phase";

export const getProjectPhases = (
  projectId: string
) =>
  api.get<Phase[]>(
    `/phase/project/${projectId}`
  );

export const createPhase = (
  data: Partial<Phase>
) =>
  api.post(
    "/phase",
    data
  );

export const updatePhase = (
  id: string,
  data: Partial<Phase>
) =>
  api.put(
    `/phase/${id}`,
    data
  );

export const deletePhase = (
  id: string
) =>
  api.delete(`/phase/${id}`);