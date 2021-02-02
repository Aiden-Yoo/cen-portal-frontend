/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditPartnerInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editPartnerMutation
// ====================================================

export interface editPartnerMutation_editPartner {
  __typename: "EditPartnerOutput";
  ok: boolean;
  error: string | null;
}

export interface editPartnerMutation {
  editPartner: editPartnerMutation_editPartner;
}

export interface editPartnerMutationVariables {
  input: EditPartnerInput;
}
