/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateDemoInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createDemoMutation
// ====================================================

export interface createDemoMutation_createDemo {
  __typename: "CreateDemoOutput";
  ok: boolean;
  error: string | null;
}

export interface createDemoMutation {
  createDemo: createDemoMutation_createDemo;
}

export interface createDemoMutationVariables {
  input: CreateDemoInput;
}
