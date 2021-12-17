/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRmaInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createRmaMutation
// ====================================================

export interface createRmaMutation_createRma {
  __typename: "CreateRmaOutput";
  ok: boolean;
  error: string | null;
}

export interface createRmaMutation {
  createRma: createRmaMutation_createRma;
}

export interface createRmaMutationVariables {
  input: CreateRmaInput;
}
