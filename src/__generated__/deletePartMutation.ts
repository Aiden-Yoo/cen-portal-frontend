/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeletePartInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deletePartMutation
// ====================================================

export interface deletePartMutation_deletePart {
  __typename: "DeletePartOutput";
  ok: boolean;
  error: string | null;
}

export interface deletePartMutation {
  deletePart: deletePartMutation_deletePart;
}

export interface deletePartMutationVariables {
  input: DeletePartInput;
}
