import { News_news_attachment as Attachment } from "../gql/__generated__/News";

export const dataUrl = ENV_DATA_URL || "https://cyberpunk2219.tech/data";

export const getAttachmentUrl = (attachment: Attachment): string => `${dataUrl}/attachments/${attachment.id}/${attachment.name}`;

export const professions: {
  [key: string]: string;
} = {
  None: "Нет профессии",
  Netrunner: "Нетраннер",
  Medic: "Медик",
  Chemist: "Химик",
  Marshal: "Маршал",
  Hitman: "Боевик",
  Biotechnician: "Биотехник",
  Employee: "Корпоративный работник",
  Engineer: "Инженер",
  Stalker: "Сталкер",
  Mutant: "Мутант",
};

export const getProfessionText = (profession: string, professionLevel?: number): string =>
  professions[profession] ? professions[profession] + (professionLevel ? ` (${professionLevel})` : "") : "";
