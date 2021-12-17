/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteRmaInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteRmaMutation
// ====================================================

export interface deleteRmaMutation_deleteRma {
  __typename: "DeleteRmaOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteRmaMutation {
  deleteRma: deleteRmaMutation_deleteRma;
}

export interface deleteRmaMutationVariables {
  input: DeleteRmaInput;
}
