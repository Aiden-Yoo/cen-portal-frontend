/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllFirmwaresInput, KindFirmware } from "./globalTypes";

// ====================================================
// GraphQL query operation: allFirmwaresQuery
// ====================================================

export interface allFirmwaresQuery_allFirmwares_firmwares_writer {
  __typename: "User";
  id: number;
  name: string;
  company: string;
}

export interface allFirmwaresQuery_allFirmwares_firmwares_files {
  __typename: "FirmwareFiles";
  id: number;
  path: string;
}

export interface allFirmwaresQuery_allFirmwares_firmwares {
  __typename: "Firmwares";
  id: number;
  writer: allFirmwaresQuery_allFirmwares_firmwares_writer | null;
  locked: boolean | null;
  kind: KindFirmware;
  title: string;
  files: allFirmwaresQuery_allFirmwares_firmwares_files[] | null;
  createAt: any;
  updateAt: any;
}

export interface allFirmwaresQuery_allFirmwares {
  __typename: "AllFirmwaresOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  firmwares: allFirmwaresQuery_allFirmwares_firmwares[] | null;
}

export interface allFirmwaresQuery {
  allFirmwares: allFirmwaresQuery_allFirmwares;
}

export interface allFirmwaresQueryVariables {
  input: AllFirmwaresInput;
}
