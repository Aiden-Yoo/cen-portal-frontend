/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetMaintenanceInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getMaintenanceQuery
// ====================================================

export interface getMaintenanceQuery_getMaintenance_maintenance_writer {
  __typename: "User";
  name: string;
}

export interface getMaintenanceQuery_getMaintenance_maintenance_distPartner {
  __typename: "Partner";
  name: string;
}

export interface getMaintenanceQuery_getMaintenance_maintenance_items_bundle {
  __typename: "Bundle";
  name: string;
}

export interface getMaintenanceQuery_getMaintenance_maintenance_items {
  __typename: "MaintenanceItem";
  bundle: getMaintenanceQuery_getMaintenance_maintenance_items_bundle | null;
  num: number;
}

export interface getMaintenanceQuery_getMaintenance_maintenance_maintenanceItemInfos {
  __typename: "MaintenanceItemInfo";
  name: string;
  serialNumber: string | null;
}

export interface getMaintenanceQuery_getMaintenance_maintenance {
  __typename: "Maintenance";
  id: number;
  createAt: any;
  updateAt: any;
  contractNo: string;
  writer: getMaintenanceQuery_getMaintenance_maintenance_writer | null;
  salesPerson: string;
  projectName: string | null;
  distPartner: getMaintenanceQuery_getMaintenance_maintenance_distPartner | null;
  reqPartner: string | null;
  startDate: any | null;
  endDate: any | null;
  description: string | null;
  items: getMaintenanceQuery_getMaintenance_maintenance_items[];
  maintenanceItemInfos: getMaintenanceQuery_getMaintenance_maintenance_maintenanceItemInfos[] | null;
  maintenanceStatus: string;
}

export interface getMaintenanceQuery_getMaintenance {
  __typename: "GetMaintenanceOutput";
  ok: boolean;
  error: string | null;
  maintenance: getMaintenanceQuery_getMaintenance_maintenance | null;
}

export interface getMaintenanceQuery {
  getMaintenance: getMaintenanceQuery_getMaintenance;
}

export interface getMaintenanceQueryVariables {
  input: GetMaintenanceInput;
}
