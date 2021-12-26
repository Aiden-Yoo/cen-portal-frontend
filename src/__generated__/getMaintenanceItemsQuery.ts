/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetMaintenanceItemsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getMaintenanceItemsQuery
// ====================================================

export interface getMaintenanceItemsQuery_getMaintenanceItems_itemInfos {
  __typename: "MaintenanceItemInfo";
  id: number;
  name: string;
  serialNumber: string | null;
}

export interface getMaintenanceItemsQuery_getMaintenanceItems {
  __typename: "GetMaintenanceItemsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  itemInfos: getMaintenanceItemsQuery_getMaintenanceItems_itemInfos[] | null;
}

export interface getMaintenanceItemsQuery {
  getMaintenanceItems: getMaintenanceItemsQuery_getMaintenanceItems;
}

export interface getMaintenanceItemsQueryVariables {
  input: GetMaintenanceItemsInput;
}
