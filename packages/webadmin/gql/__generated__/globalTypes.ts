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

export interface AttachmentInput {
  file: any;
  type: AttachmentType;
}

export interface EditUserInput {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  vkId?: string | null;
  medicalInfo?: string | null;
  city?: string | null;
}

export interface FullCharacterInput {
  name?: string | null;
  quenta?: any | null;
  roles?: CharacterRole[] | null;
  profession?: Profession | null;
  registrationProfession?: Profession | null;
  professionLevel?: number | null;
  balance?: number | null;
  state?: CharacterState | null;
  pollution?: number | null;
  deathTime?: any | null;
  implantsRejectTime?: any | null;
  locationId?: number | null;
}

export interface FullImplantInput {
  characterId?: number | null;
  name?: string | null;
  type?: ImplantType | null;
  working?: boolean | null;
  quality?: boolean | null;
}

export interface LocationInput {
  name?: string | null;
}

export interface NewsInput {
  title?: string | null;
  text?: string | null;
  datetime?: any | null;
  attachment?: AttachmentInput | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
