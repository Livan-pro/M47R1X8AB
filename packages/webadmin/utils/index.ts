import { News_news_attachment as Attachment } from "../gql/__generated__/News";
import { CharacterRole, ImplantType } from "../gql/__generated__/globalTypes";

const getDataUrl = (): string => {
  if (process.env.NODE_ENV !== "production") return process.env.DATA_URL;
  let host = window.location.host;
  if (host.startsWith("admin.")) host = host.substring(6);
  return "//" + host + "/data";
};

export const dataUrl = getDataUrl();

export const getAttachmentUrl = (attachment: Attachment): string => `${dataUrl}/attachments/${attachment.id}/${attachment.name}`;

export const maxChars = (amount: number): ((input: string) => boolean | string) => (input): boolean | string =>
  input.length <= amount || "Слишком длинное значение";

const makeOptions = (obj: { [key: string]: string }) => Object.entries(obj).map(([k, v]): { value: string; text: string } => ({ value: k, text: v }));

export const characterRoles: {
  [key: string]: string;
} = Object.freeze({
  None: "Не выбрана",
  Netrunner: "Нетраннер",
  Medic: "Медик",
  Technician: "Техник",
  Replicant: "Репликант",
  Android: "Андроид",
  NPC: "NPC",
});

export const characterRoleOptions = makeOptions(characterRoles);

export function characterRolesToText(roles: CharacterRole[]): string {
  console.log(roles, typeof roles);
  return roles.map((role): string => characterRoles[role]).join(", ");
}

export const states: {
  [key: string]: string;
} = Object.freeze({
  Normal: "Норма",
  Pollution: "Загрязнение",
  SevereWound: "Тяжёлое ранение",
  Death: "Смерть",
});

export const stateOptions = makeOptions(states);

export const implantTypes: {
  [key: string]: string;
} = Object.freeze({
  Brain: "Мозговой",
  Limb: "Конечности",
  Internal: "Внутренний",
});

export const implantTypeOptions = makeOptions(implantTypes);
export const implantTypeToText = (type: ImplantType): string => implantTypes[type];
