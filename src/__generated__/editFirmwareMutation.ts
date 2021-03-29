/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditFirmwareInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editFirmwareMutation
// ====================================================

export interface editFirmwareMutation_editFirmware {
  __typename: "EditFirmwareOutput";
  ok: boolean;
  error: string | null;
}

export interface editFirmwareMutation {
  editFirmware: editFirmwareMutation_editFirmware;
}

export interface editFirmwareMutationVariables {
  input: EditFirmwareInput;
}
