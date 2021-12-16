/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditDemoInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editDemoMutation
// ====================================================

export interface editDemoMutation_editDemo {
  __typename: "EditDemoOutput";
  ok: boolean;
  error: string | null;
}

export interface editDemoMutation {
  editDemo: editDemoMutation_editDemo;
}

export interface editDemoMutationVariables {
  input: EditDemoInput;
}
