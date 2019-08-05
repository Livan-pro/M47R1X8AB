const getDataUrl = (): string => {
  if (process.env.NODE_ENV !== "production") return process.env.DATA_URL;
  let host = window.location.host;
  if (host.startsWith("admin.")) host = host.substring(6);
  return "//" + host + "/data";
};

export const dataUrl = getDataUrl();
