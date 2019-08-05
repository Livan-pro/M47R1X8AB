export function InitForm<T extends object>(obj: T, values?: any): T {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) (obj[key] as any) = "";
  }
  if (values) {
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        if (obj.hasOwnProperty(key)) (obj as any)[key] = values[key];
        else Object.assign(obj, {[key]: values[key]});
      }
    }
  }
  return obj;
}
