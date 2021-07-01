/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editUserMutation
// ====================================================

export interface editUserMutation_editUser {
  __typename: "EditUserOutput";
  ok: boolean;
  error: string | null;
}

export interface editUserMutation {
  editUser: editUserMutation_editUser;
}

export interface editUserMutationVariables {
  input: EditUserInput;
}
