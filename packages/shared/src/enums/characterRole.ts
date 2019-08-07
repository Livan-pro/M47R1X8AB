const roles: {
  [key: string]: string,
} = Object.freeze({
  None: "Не выбрана",
  Netrunner: "Нетраннер",
  Medic: "Медик",
  Chemist: "Химик",
  Marshal: "Маршал",
  Hitman: "Боевик",
  Biotechnician: "Биотехник",
  Employee: "Корпоратирный работник",
  Engineer: "Инженер",
  Stalker: "Сталкер",
  Mutant: "Мутант",
});

export const characterRoleOptions = Object.entries(roles).map(([k, v]) => ({value: k, text: v}));

export function characterRoleToText(role: string | any) {
  const text = roles[role];
  if (!text) return roles.None;
  return text;
}
