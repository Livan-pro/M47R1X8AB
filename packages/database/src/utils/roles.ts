import { Role } from "./role.enum";

// tslint:disable no-bitwise
const reduceRoles: (roles: Role[] | number[]) => number =
  (roles: Role[] | number[]) =>
    (roles.reduce as (callbackfn: (previousValue: number, currentValue: Role | number) => number, initialValue: number) => number)
      ((acc, v) => acc | v, Role.LoggedIn as number);

export class Roles extends Number {
  has(role: Role | Roles | number | Role[] | number[]): boolean {
    if (Array.isArray(role)) role = reduceRoles(role);
    return ((this as any) & (role as number)) === role;
  }

  intersects(role: Role | Roles | number | Role[] | number[]): boolean {
    if (Array.isArray(role)) role = reduceRoles(role);
    return ((this as any) & (role as number)) > 0;
  }

  add(role: Role | Roles | number | Role[] | number[]): Roles {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (!this.has(role)) return new Roles((this as unknown as number) | (role as number));
    return this;
  }

  remove(role: Role | Roles | number | Role[] | number[]): Roles {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (this.has(role)) return new Roles((this as unknown as number) & ~(role as number));
    return this;
  }

  toNumber(): number {
    return Number(this);
  }

  toArray(): Role[] {
    return Object.values(Role).filter(role => ((this as any) & (role as number)) === role);
  }
}