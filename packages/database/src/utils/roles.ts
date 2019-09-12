import { CharacterRole } from "./character-role.enum";
import { UserRole } from "./user-role.enum";
export type RoleEnum = typeof UserRole | typeof CharacterRole;

// tslint:disable no-bitwise
const reduceRoles: (roles: number[]) => number =
  (roles: number[]) => roles.reduce((acc, v) => acc | v as number, 0);

// tslint:disable no-bitwise
const reduceRoleKeys = <T extends RoleEnum>(values: (keyof T)[], enumObj: T) =>
  values.reduce((acc, v) => acc | (typeof v === "number" ? v : enumObj[v] as unknown as number), 0);

export class Roles<Role extends RoleEnum> implements Iterable<string> {
  private number: number;
  constructor(role: number | Roles<Role> | (keyof Role)[], private roleEnum: Role) {
    if (Array.isArray(role)) this.number = reduceRoleKeys(role, roleEnum);
    else if (role instanceof Roles) this.number = role.toNumber();
    else this.number = role;
  }

  has(role: Roles<Role> | number | number[]): boolean {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    return (this.number & (role as number)) === role;
  }

  intersects(role: Roles<Role> | number | number[]): boolean {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    return (this.number & (role as number)) > 0;
  }

  add(role: Roles<Role> | number | number[]): Roles<Role> {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    if (!this.has(role)) return new Roles<Role>(this.number | (role as number), this.roleEnum);
    return this;
  }

  remove(role: Roles<Role> | number | number[]): Roles<Role> {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    if (this.has(role)) return new Roles<Role>(this.number & ~(role as number), this.roleEnum);
    return this;
  }

  toNumber(): number {
    return this.number;
  }

  toArray(): number[] {
    return (Object.values(this.roleEnum))
      .filter(role => typeof role === "number" && role !== 0 && (this.number & (role as number)) === role);
  }

  toStringArray(): string[] {
    return this.toArray().map(v => (this.roleEnum as any)[v]);
  }

  [Symbol.iterator](): Iterator<string> {
    let pointer = 0;
    const roles = this.toStringArray();
    return {
      next(): IteratorResult<string> {
        if (pointer < roles.length) {
          return {
            done: false,
            value: roles[pointer++],
          };
        } else {
          return {
            done: true,
            value: null as any,
          };
        }
      },
    };
  }
}