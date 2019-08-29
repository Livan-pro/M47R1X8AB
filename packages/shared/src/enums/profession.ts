const professions: {
  [key: string]: string,
} = Object.freeze({
  None: "Не выбрана",
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
});

export const professionOptions = Object.entries(professions).map(([k, v]) => ({value: k, text: v}));

export function professionToText(profession: string | any) {
  const text = professions[profession];
  if (!text) return professions.None;
  return text;
}
