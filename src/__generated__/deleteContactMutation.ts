/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteContactInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteContactMutation
// ====================================================

export interface deleteContactMutation_deleteContact {
  __typename: "DeleteContactOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteContactMutation {
  deleteContact: deleteContactMutation_deleteContact;
}

export interface deleteContactMutationVariables {
  input: DeleteContactInput;
}
