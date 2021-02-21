/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BundleInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getBundleQuery
// ====================================================

export interface getBundleQuery_findBundleById_bundle_parts_part {
  __typename: "Part";
  id: number;
  name: string;
  series: string;
}

export interface getBundleQuery_findBundleById_bundle_parts {
  __typename: "BundleItem";
  num: number | null;
  part: getBundleQuery_findBundleById_bundle_parts_part;
}

export interface getBundleQuery_findBundleById_bundle {
  __typename: "Bundle";
  id: number;
  name: string;
  series: string | null;
  description: string | null;
  parts: getBundleQuery_findBundleById_bundle_parts[] | null;
}

export interface getBundleQuery_findBundleById {
  __typename: "BundleOutput";
  ok: boolean;
  error: string | null;
  bundle: getBundleQuery_findBundleById_bundle | null;
}

export interface getBundleQuery {
  findBundleById: getBundleQuery_findBundleById;
}

export interface getBundleQueryVariables {
  input: BundleInput;
}
