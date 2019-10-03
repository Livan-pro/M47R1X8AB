/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AttachmentType {
  Audio = "Audio",
  Image = "Image",
  Video = "Video",
}

export enum CharacterRole {
  Android = "Android",
  Medic = "Medic",
  NPC = "NPC",
  Netrunner = "Netrunner",
  None = "None",
  Replicant = "Replicant",
  Technician = "Technician",
}

export enum CharacterState {
  Death = "Death",
  Normal = "Normal",
  Pollution = "Pollution",
  SevereWound = "SevereWound",
}

export enum ImplantType {
  Brain = "Brain",
  Internal = "Internal",
  Limb = "Limb",
}

export enum Profession {
  Biotechnician = "Biotechnician",
  Chemist = "Chemist",
  Employee = "Employee",
  Engineer = "Engineer",
  Hitman = "Hitman",
  Marshal = "Marshal",
  Medic = "Medic",
  Mutant = "Mutant",
  Netrunner = "Netrunner",
  None = "None",
  Stalker = "Stalker",
}

export enum UserRole {
  Admin = "Admin",
  SuperAdmin = "SuperAdmin",
}

export interface FullImplantInput {
  characterId?: number | null;
  name?: string | null;
  type?: ImplantType | null;
  working?: boolean | null;
  quality?: boolean | null;
}

export interface MessageInput {
  text: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
