/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteOrderMutation
// ====================================================

export interface deleteOrderMutation_deleteOrder {
  __typename: "DeleteOrderOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteOrderMutation {
  deleteOrder: deleteOrderMutation_deleteOrder;
}

export interface deleteOrderMutationVariables {
  input: DeleteOrderInput;
}
