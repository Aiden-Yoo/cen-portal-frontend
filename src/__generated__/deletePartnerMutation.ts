/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeletePartnerInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deletePartnerMutation
// ====================================================

export interface deletePartnerMutation_deletePartner {
  __typename: "DeletePartnerOutput";
  ok: boolean;
  error: string | null;
}

export interface deletePartnerMutation {
  deletePartner: deletePartnerMutation_deletePartner;
}

export interface deletePartnerMutationVariables {
  input: DeletePartnerInput;
}
