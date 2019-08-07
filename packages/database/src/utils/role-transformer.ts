import { ValueTransformer } from "typeorm";
import { Roles, RoleEnum } from "../utils/roles";

export class RolesTransformer<T extends RoleEnum> implements ValueTransformer {
  constructor(private roleEnum: {[key in T]: number}) {}

  to(value: Roles<T> | number | any): number {
    return value instanceof Roles ? value.toNumber() : typeof value === "number" ? value : 0;
  }

  from(value: number): Roles<T> {
    return new Roles<T>(value, this.roleEnum);
  }
}