/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteWorkaroundInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteWorkaroundMutation
// ====================================================

export interface deleteWorkaroundMutation_deleteWorkaround {
  __typename: "DeleteWorkaroundOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteWorkaroundMutation {
  deleteWorkaround: deleteWorkaroundMutation_deleteWorkaround;
}

export interface deleteWorkaroundMutationVariables {
  input: DeleteWorkaroundInput;
}
