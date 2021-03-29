/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateFirmwareInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createFirmwareMutation
// ====================================================

export interface createFirmwareMutation_createFirmware_firmware {
  __typename: "Firmwares";
  id: number;
}

export interface createFirmwareMutation_createFirmware {
  __typename: "CreateFirmwareOutput";
  ok: boolean;
  error: string | null;
  firmware: createFirmwareMutation_createFirmware_firmware;
}

export interface createFirmwareMutation {
  createFirmware: createFirmwareMutation_createFirmware;
}

export interface createFirmwareMutationVariables {
  input: CreateFirmwareInput;
}
