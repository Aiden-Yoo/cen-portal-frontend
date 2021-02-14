/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePartInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createPartMutation
// ====================================================

export interface createPartMutation_createPart {
  __typename: "CreatePartOutput";
  ok: boolean;
  error: string | null;
}

export interface createPartMutation {
  createPart: createPartMutation_createPart;
}

export interface createPartMutationVariables {
  input: CreatePartInput;
}
