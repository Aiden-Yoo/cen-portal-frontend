/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteFirmwareInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteFirmwareMutation
// ====================================================

export interface deleteFirmwareMutation_deleteFirmware {
  __typename: "DeleteFirmwareOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteFirmwareMutation {
  deleteFirmware: deleteFirmwareMutation_deleteFirmware;
}

export interface deleteFirmwareMutationVariables {
  input: DeleteFirmwareInput;
}
