/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditContactInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editContactMutation
// ====================================================

export interface editContactMutation_editContact {
  __typename: "EditContactOutput";
  ok: boolean;
  error: string | null;
}

export interface editContactMutation {
  editContact: editContactMutation_editContact;
}

export interface editContactMutationVariables {
  input: EditContactInput;
}
