import { Role } from "./role.enum";

// tslint:disable no-bitwise
const reduceRoles: (roles: Role[] | number[]) => number =
  (roles: Role[] | number[]) =>
    (roles.reduce as (callbackfn: (previousValue: number, currentValue: Role | number) => number, initialValue: number) => number)
      ((acc, v) => acc | v, Role.LoggedIn as number);

export class Roles {
  private number: number;
  constructor(role: number | Role | Roles) {
    if (role instanceof Roles) this.number = role.toNumber();
    else this.number = role;
  }

  has(role: Role | Roles | number | Role[] | number[]): boolean {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    return (this.number & (role as number)) === role;
  }

  intersects(role: Role | Roles | number | Role[] | number[]): boolean {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    return (this.number & (role as number)) > 0;
  }

  add(role: Role | Roles | number | Role[] | number[]): Roles {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    if (!this.has(role)) return new Roles(this.number | (role as number));
    return this;
  }

  remove(role: Role | Roles | number | Role[] | number[]): Roles {
    if (Array.isArray(role)) role = reduceRoles(role);
    if (role instanceof Roles) role = role.toNumber();
    if (this.has(role)) return new Roles(this.number & ~(role as number));
    return this;
  }

  toNumber(): number {
    return this.number;
  }

  toArray(): Role[] {
    return Object.values(Role).filter(role => (this.number & (role as number)) === role);
  }
}