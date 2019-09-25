export const codeToString = <T extends {code: Buffer}>(obj: T) => ({...obj, code: obj.code.toString("hex")});
export const mapCodeToString = <T extends {code: Buffer}>(arr: T[]) => arr.map(obj => codeToString(obj));
