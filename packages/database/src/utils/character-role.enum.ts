// tslint:disable:no-bitwise
export enum CharacterRole {
  None = 0,
  Netrunner = 1 << 0,
  Medic = 1 << 1,
  Technician = 1 << 2,
  Replicant = 1 << 3,
  Android = 1 << 4,
  NPC = 1 << 5,
}