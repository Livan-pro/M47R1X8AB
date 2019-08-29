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

export interface NewsInput {
  title?: string | null;
  text?: string | null;
  datetime?: any | null;
  attachment?: AttachmentInput | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
