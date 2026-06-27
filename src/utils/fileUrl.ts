export function getFileUrl(
  path?: string
) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const apiBase =
    import.meta.env
      .VITE_API_BASE_URL || "";

  const serverBase = apiBase.replace(
    /\/api\/?$/,
    ""
  );

  return `${serverBase}${
    path.startsWith("/")
      ? path
      : `/${path}`
  }`;
}

export function sanitizePhone(
  mobile?: string
) {
  if (!mobile) {
    return "";
  }

  const digits = mobile.replace(
    /\D/g,
    ""
  );

  if (digits.length === 10) {
    return digits;
  }

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return digits.slice(2);
  }

  return digits;
}
