/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditWorkaroundInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editWorkaroundMutation
// ====================================================

export interface editWorkaroundMutation_editWorkaround {
  __typename: "EditWorkaroundOutput";
  ok: boolean;
  error: string | null;
}

export interface editWorkaroundMutation {
  editWorkaround: editWorkaroundMutation_editWorkaround;
}

export interface editWorkaroundMutationVariables {
  input: EditWorkaroundInput;
}
