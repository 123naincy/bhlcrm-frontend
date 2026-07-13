export function toDatetimeLocalValue(
  value?: string | Date | null
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset() * 60000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

export function formatDisplayDateTime(
  value?: string | Date | null
) {
  if (!value) return "No date set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date set";
  }

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
