import { SetMetadata } from "@nestjs/common";
import { UserRole } from "matrix-database";

// tslint:disable-next-line: variable-name
export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
