export function InitForm(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) obj[key] = "";
  }
  return obj;
}
