/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetFirmwareInput, KindFirmware } from "./globalTypes";

// ====================================================
// GraphQL query operation: getFirmwareQuery
// ====================================================

export interface getFirmwareQuery_getFirmware_firmware_writer {
  __typename: "User";
  id: number;
  company: string;
  name: string;
}

export interface getFirmwareQuery_getFirmware_firmware_files {
  __typename: "FirmwareFiles";
  id: number;
  path: string;
}

export interface getFirmwareQuery_getFirmware_firmware {
  __typename: "Firmwares";
  id: number;
  title: string;
  kind: KindFirmware;
  content: string;
  locked: boolean | null;
  writer: getFirmwareQuery_getFirmware_firmware_writer | null;
  files: getFirmwareQuery_getFirmware_firmware_files[] | null;
}

export interface getFirmwareQuery_getFirmware {
  __typename: "GetFirmwareOutput";
  ok: boolean;
  error: string | null;
  firmware: getFirmwareQuery_getFirmware_firmware | null;
}

export interface getFirmwareQuery {
  getFirmware: getFirmwareQuery_getFirmware;
}

export interface getFirmwareQueryVariables {
  input: GetFirmwareInput;
}
