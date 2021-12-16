/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteDemoInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteDemoMutation
// ====================================================

export interface deleteDemoMutation_deleteDemo {
  __typename: "DeleteDemoOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteDemoMutation {
  deleteDemo: deleteDemoMutation_deleteDemo;
}

export interface deleteDemoMutationVariables {
  input: DeleteDemoInput;
}
