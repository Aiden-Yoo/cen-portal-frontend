/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditItemInfoInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editItemInfoMutation
// ====================================================

export interface editItemInfoMutation_editItemInfo {
  __typename: "EditItemInfoOutput";
  ok: boolean;
  error: string | null;
}

export interface editItemInfoMutation {
  editItemInfo: editItemInfoMutation_editItemInfo;
}

export interface editItemInfoMutationVariables {
  input: EditItemInfoInput;
}
