/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateContactInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createContactMutation
// ====================================================

export interface createContactMutation_createContact {
  __typename: "CreateContactOutput";
  ok: boolean;
  error: string | null;
}

export interface createContactMutation {
  createContact: createContactMutation_createContact;
}

export interface createContactMutationVariables {
  input: CreateContactInput;
}
