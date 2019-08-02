import { SetMetadata } from "@nestjs/common";
import { Role } from "matrix-database";

// tslint:disable-next-line: variable-name
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
