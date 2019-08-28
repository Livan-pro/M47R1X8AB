import { News_news_attachment as Attachment } from "../gql/__generated__/News";

export const dataUrl = ENV_DATA_URL || "https://cyberpunk2219.tech/data";

export const getAttachmentUrl = (attachment: Attachment): string => `${dataUrl}/attachments/${attachment.id}/${attachment.name}`;
