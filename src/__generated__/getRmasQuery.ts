/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetRmasInput, Classification } from "./globalTypes";

// ====================================================
// GraphQL query operation: getRmasQuery
// ====================================================

export interface getRmasQuery_getRmas_rmas {
  __typename: "Rma";
  id: number;
  createAt: any;
  updateAt: any;
  classification: Classification | null;
  model: string | null;
  projectName: string | null;
  returnDate: any | null;
  returnSrc: string | null;
  returnSn: string | null;
  deliverDst: string | null;
  deliverDate: any | null;
  deliverSn: string | null;
  reenactment: boolean | null;
  person: string | null;
  description: string | null;
  rmaStatus: string;
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
