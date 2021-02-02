/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editOrderMutation
// ====================================================

export interface editOrderMutation_editOrder {
  __typename: "EditOPrderOutput";
  ok: boolean;
  error: string | null;
}

export interface editOrderMutation {
  editOrder: editOrderMutation_editOrder;
}

export interface editOrderMutationVariables {
  input: EditOrderInput;
}
