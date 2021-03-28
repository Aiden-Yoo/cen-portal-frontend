/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateWorkaroundInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createWorkaroundMutation
// ====================================================

export interface createWorkaroundMutation_createWorkaround_workaround {
  __typename: "Workarounds";
  id: number;
}

export interface createWorkaroundMutation_createWorkaround {
  __typename: "CreateWorkaroundOutput";
  ok: boolean;
  error: string | null;
  workaround: createWorkaroundMutation_createWorkaround_workaround;
}

export interface createWorkaroundMutation {
  createWorkaround: createWorkaroundMutation_createWorkaround;
}

export interface createWorkaroundMutationVariables {
  input: CreateWorkaroundInput;
}
