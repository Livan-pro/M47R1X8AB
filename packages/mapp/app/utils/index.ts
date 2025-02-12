import { News_news_attachment as Attachment } from "../gql/__generated__/News";
import { ImplantType, CharacterState } from "@/gql/__generated__/globalTypes";

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

export const month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

export const implantTypes: {
  [key: string]: string;
} = {
  Limb: "Конечности",
  Brain: "Мозговой",
  Internal: "Внутренний",
};

export const getImplantTypeText = (type: ImplantType): string => implantTypes[type] || "";

export const stateText = Object.freeze({
  [CharacterState.Normal]: "Норма",
  [CharacterState.Pollution]: "Загрязнение",
  [CharacterState.SevereWound]: "Тяжёлое ранение",
  [CharacterState.Death]: "Смерть",
});

export const stateColor = Object.freeze({
  [CharacterState.Normal]: "primary",
  [CharacterState.Pollution]: "orange",
  [CharacterState.SevereWound]: "red",
  [CharacterState.Death]: "red",
});
