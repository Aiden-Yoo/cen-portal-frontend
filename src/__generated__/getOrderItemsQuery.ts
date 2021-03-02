/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrderItemsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrderItemsQuery
// ====================================================

export interface getOrderItemsQuery_getOrderItems_itemInfos {
  __typename: "ItemInfo";
  id: number;
  name: string;
  serialNumber: string | null;
}

export interface getOrderItemsQuery_getOrderItems {
  __typename: "GetOrderItemsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  itemInfos: getOrderItemsQuery_getOrderItems_itemInfos[] | null;
}

export interface getOrderItemsQuery {
  getOrderItems: getOrderItemsQuery_getOrderItems;
}

export interface getOrderItemsQueryVariables {
  input: GetOrderItemsInput;
}
