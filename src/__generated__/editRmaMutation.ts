/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditRmaInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editRmaMutation
// ====================================================

export interface editRmaMutation_editRma {
  __typename: "EditRmaOutput";
  ok: boolean;
  error: string | null;
}

export interface editRmaMutation {
  editRma: editRmaMutation_editRma;
}

export interface editRmaMutationVariables {
  input: EditRmaInput;
}
