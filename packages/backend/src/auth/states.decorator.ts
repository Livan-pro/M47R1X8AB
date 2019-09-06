import { SetMetadata } from "@nestjs/common";
import { CharacterState } from "matrix-database";

// tslint:disable-next-line: variable-name
export const States = (...states: CharacterState[]) => SetMetadata("states", states);
