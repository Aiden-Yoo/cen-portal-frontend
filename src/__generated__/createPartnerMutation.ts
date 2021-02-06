/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePartnerInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createPartnerMutation
// ====================================================

export interface createPartnerMutation_createPartner {
  __typename: "CreatePartnerOutput";
  ok: boolean;
  error: string | null;
}

export interface createPartnerMutation {
  createPartner: createPartnerMutation_createPartner;
}

export interface createPartnerMutationVariables {
  input: CreatePartnerInput;
}
