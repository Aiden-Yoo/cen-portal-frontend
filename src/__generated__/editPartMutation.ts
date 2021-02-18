/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditPartInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editPartMutation
// ====================================================

export interface editPartMutation_editPart {
  __typename: "EditPartOutput";
  ok: boolean;
  error: string | null;
}

export interface editPartMutation {
  editPart: editPartMutation_editPart;
}

export interface editPartMutationVariables {
  input: EditPartInput;
}
