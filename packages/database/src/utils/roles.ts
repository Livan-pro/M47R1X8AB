import { CharacterRole } from "./character-role.enum";
import { UserRole } from "./user-role.enum";
export type RoleEnum = UserRole | CharacterRole;

// tslint:disable no-bitwise
const reduceRoles: (roles: number[]) => number =
  (roles: number[]) => roles.reduce((acc, v) => acc | v as number, 0);

export class Roles<Role extends RoleEnum> {
  private number: number;
  constructor(role: number | Roles<Role>) {
    if (role instanceof Roles) this.number = role.toNumber();
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
    if (!this.has(role)) return new Roles<Role>(this.number | (role as number));
    return this;
  }

  remove(role: Roles<Role> | number | number[]): Roles<Role> {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    if (this.has(role)) return new Roles<Role>(this.number & ~(role as number));
    return this;
  }

  toNumber(): number {
    return this.number;
  }

  toArray(RoleClass: {[key in Role]: number}): number[] {
    return (Object.values(RoleClass) as number[]).filter(role => typeof role === "number" && (this.number & (role as number)) === role);
  }

  toStringArray(RoleClass: {[value: number]: Role}): string[] {
    return this.toArray(RoleClass).map(v => RoleClass[v]) as unknown[] as string[];
  }
}