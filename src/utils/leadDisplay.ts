export const getProjectLabel = (lead: any) => {
  if (!lead) return "-";

  if (lead.projectName?.trim()) {
    return lead.projectName.trim();
  }

  if (lead.projectId?.name?.trim()) {
    return lead.projectId.name.trim();
  }

  if (lead.projectInterest?.trim()) {
    return lead.projectInterest.trim();
  }

  const extra = lead.extraFields || {};
  const priorityKeys = [
    "Form",
    "form",
    "Project",
    "project",
    "Project Name",
    "project name",
    "projectName",
  ];

  for (const key of priorityKeys) {
    const value = extra[key];

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  for (const [key, value] of Object.entries(extra)) {
    const normalized = key.toLowerCase().trim();

    if (
      normalized === "form" ||
      normalized === "project" ||
      normalized === "project name" ||
      normalized === "projectname"
    ) {
      if (value !== undefined && value !== null && String(value).trim()) {
        return String(value).trim();
      }
    }
  }

  return "-";
};
