/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteMaintenanceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteMaintenanceMutation
// ====================================================

export interface deleteMaintenanceMutation_deleteMaintenance {
  __typename: "DeleteMaintenanceOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteMaintenanceMutation {
  deleteMaintenance: deleteMaintenanceMutation_deleteMaintenance;
}

export interface deleteMaintenanceMutationVariables {
  input: DeleteMaintenanceInput;
}
