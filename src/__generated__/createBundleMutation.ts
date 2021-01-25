/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateBundleInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createBundleMutation
// ====================================================

export interface createBundleMutation_createBundle {
  __typename: "CreateBundleOutput";
  ok: boolean;
  error: string | null;
}

export interface createBundleMutation {
  createBundle: createBundleMutation_createBundle;
}

export interface createBundleMutationVariables {
  input: CreateBundleInput;
}
