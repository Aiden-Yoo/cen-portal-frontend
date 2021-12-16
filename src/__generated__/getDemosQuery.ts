/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetDemosInput, DemoStatus, Origin } from "./globalTypes";

// ====================================================
// GraphQL query operation: getDemosQuery
// ====================================================

export interface getDemosQuery_getDemos_demos {
  __typename: "Demo";
  id: number;
  createAt: any;
  status: DemoStatus | null;
  deliverDate: any | null;
  returnDate: any | null;
  projectName: string | null;
  model: string | null;
  serialNumber: string | null;
  salesPerson: string | null;
  applier: string | null;
  receiver: string | null;
  partner: string | null;
  partnerPerson: string | null;
  origin: Origin | null;
  description: string | null;
}

export interface getDemosQuery_getDemos {
  __typename: "GetDemosOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  demos: getDemosQuery_getDemos_demos[] | null;
}

export interface getDemosQuery {
  getDemos: getDemosQuery_getDemos;
}

export interface getDemosQueryVariables {
  input: GetDemosInput;
}
