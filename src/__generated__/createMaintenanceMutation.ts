/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateMaintenanceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createMaintenanceMutation
// ====================================================

export interface createMaintenanceMutation_createMaintenance {
  __typename: "CreateMaintenanceOutput";
  ok: boolean;
  error: string | null;
}

export interface createMaintenanceMutation {
  createMaintenance: createMaintenanceMutation_createMaintenance;
}

export interface createMaintenanceMutationVariables {
  input: CreateMaintenanceInput;
}
