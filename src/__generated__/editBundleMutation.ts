/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditBundleInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editBundleMutation
// ====================================================

export interface editBundleMutation_editBundle {
  __typename: "EditBundleOutput";
  ok: boolean;
  error: string | null;
}

export interface editBundleMutation {
  editBundle: editBundleMutation_editBundle;
}

export interface editBundleMutationVariables {
  input: EditBundleInput;
}
