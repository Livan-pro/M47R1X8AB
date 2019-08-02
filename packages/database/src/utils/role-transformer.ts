import { ValueTransformer } from "typeorm";
import { Roles } from "../utils/roles";

export class RolesTransformer implements ValueTransformer {
  to(value: Roles): number {
    return value ? Number(value) : 0;
  }

  from(value: number): Roles {
    return new Roles(value);
  }
}