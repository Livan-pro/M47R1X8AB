import { News_news_attachment as Attachment } from "../gql/__generated__/News";

const getDataUrl = (): string => {
  if (process.env.NODE_ENV !== "production") return process.env.DATA_URL;
  let host = window.location.host;
  if (host.startsWith("admin.")) host = host.substring(6);
  return "//" + host + "/data";
};

export const dataUrl = getDataUrl();

export const getAttachmentUrl = (attachment: Attachment): string => `${dataUrl}/attachments/${attachment.id}/${attachment.name}`;
