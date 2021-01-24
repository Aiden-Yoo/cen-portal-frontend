/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  CEN = "CEN",
  CENSE = "CENSE",
  Client = "Client",
  Distributor = "Distributor",
  Partner = "Partner",
}

export interface AllBundlesInput {
  page?: number | null;
  take?: number | null;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  company: string;
  team?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
}

export interface DeleteBundleInput {
  bundleId: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
