/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetRmasInput, RmaClassification, Reenactment } from "./globalTypes";

// ====================================================
// GraphQL query operation: getRmasQuery
// ====================================================

export interface getRmasQuery_getRmas_rmas {
  __typename: "Rma";
  id: number;
  createAt: any;
  updateAt: any;
  classification: RmaClassification | null;
  model: string | null;
  projectName: string | null;
  returnDate: any | null;
  returnSrc: string | null;
  returnSn: string | null;
  deliverDst: string | null;
  deliverDate: any | null;
  deliverSn: string | null;
  reenactment: Reenactment | null;
  person: string | null;
  description: string | null;
  rmaStatus: string;
  address: string | null;
  symptom: string | null;
}

export interface getRmasQuery_getRmas {
  __typename: "GetRmasOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  rmas: getRmasQuery_getRmas_rmas[] | null;
}

export interface getRmasQuery {
  getRmas: getRmasQuery_getRmas;
}

export interface getRmasQueryVariables {
  input: GetRmasInput;
}
