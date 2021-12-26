/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetMaintenancesInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getMaintenancesQuery
// ====================================================

export interface getMaintenancesQuery_getMaintenances_maintenances_writer {
  __typename: "User";
  name: string;
}

export interface getMaintenancesQuery_getMaintenances_maintenances_distPartner {
  __typename: "Partner";
  name: string;
}

export interface getMaintenancesQuery_getMaintenances_maintenances_items_bundle {
  __typename: "Bundle";
  name: string;
}

export interface getMaintenancesQuery_getMaintenances_maintenances_items {
  __typename: "MaintenanceItem";
  bundle: getMaintenancesQuery_getMaintenances_maintenances_items_bundle | null;
  num: number;
}

export interface getMaintenancesQuery_getMaintenances_maintenances {
  __typename: "Maintenance";
  id: number;
  createAt: any;
  updateAt: any;
  contractNo: string;
  writer: getMaintenancesQuery_getMaintenances_maintenances_writer | null;
  salesPerson: string;
  projectName: string | null;
  distPartner: getMaintenancesQuery_getMaintenances_maintenances_distPartner | null;
  reqPartner: string | null;
  startDate: any | null;
  endDate: any | null;
  description: string | null;
  items: getMaintenancesQuery_getMaintenances_maintenances_items[];
  maintenanceStatus: string;
}

export interface getMaintenancesQuery_getMaintenances {
  __typename: "GetMaintenancesOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  maintenances: getMaintenancesQuery_getMaintenances_maintenances[] | null;
}

export interface getMaintenancesQuery {
  getMaintenances: getMaintenancesQuery_getMaintenances;
}

export interface getMaintenancesQueryVariables {
  input: GetMaintenancesInput;
}
