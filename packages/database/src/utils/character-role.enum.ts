// tslint:disable:no-bitwise
export enum CharacterRole {
  None = 0,
  Netrunner = 1 << 0,
  Medic = 1 << 1,
  Chemist = 1 << 2,
  Marshal = 1 << 3,
  Hitman = 1 << 4,
  Biotechnician = 1 << 5,
  Employee = 1 << 6,
  Engineer = 1 << 7,
  Stalker = 1 << 8,
  Mutant = 1 << 9,
}