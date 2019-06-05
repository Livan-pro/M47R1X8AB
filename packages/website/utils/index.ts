export const objectify: (obj: any, [k, v]: any[]) => any = (obj: any, [k, v]: any[]) => (obj[k] = v, obj);
