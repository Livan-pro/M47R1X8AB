import { ValueTransformer } from "typeorm";
import { Roles } from "../utils/roles";

export class RolesTransformer implements ValueTransformer {
  to(value: Roles | number | any): number {
    return value instanceof Roles ? value.toNumber() : typeof value === "number" ? value : 0;
  }

  from(value: number): Roles {
    return new Roles(value);
  }
}