/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteBundleInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteBundleMutation
// ====================================================

export interface deleteBundleMutation_deleteBundle {
  __typename: "DeleteBundleOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteBundleMutation {
  deleteBundle: deleteBundleMutation_deleteBundle;
}

export interface deleteBundleMutationVariables {
  input: DeleteBundleInput;
}
