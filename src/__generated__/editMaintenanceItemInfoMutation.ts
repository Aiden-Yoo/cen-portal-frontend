/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditMaintenanceItemInfoInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editMaintenanceItemInfoMutation
// ====================================================

export interface editMaintenanceItemInfoMutation_editMaintenanceItemInfo {
  __typename: "EditMaintenanceItemInfoOutput";
  ok: boolean;
  error: string | null;
}

export interface editMaintenanceItemInfoMutation {
  editMaintenanceItemInfo: editMaintenanceItemInfoMutation_editMaintenanceItemInfo;
}

export interface editMaintenanceItemInfoMutationVariables {
  input: EditMaintenanceItemInfoInput;
}
