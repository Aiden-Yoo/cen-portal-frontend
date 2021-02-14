/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllBundlesInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allBundlesQuery
// ====================================================

export interface allBundlesQuery_allBundles_bundles_parts_part {
  __typename: "Part";
  id: number;
  name: string;
  series: string;
}

export interface allBundlesQuery_allBundles_bundles_parts {
  __typename: "BundleItem";
  num: number | null;
  part: allBundlesQuery_allBundles_bundles_parts_part;
}

export interface allBundlesQuery_allBundles_bundles {
  __typename: "Bundle";
  id: number;
  name: string;
  series: string | null;
  description: string | null;
  parts: allBundlesQuery_allBundles_bundles_parts[] | null;
}

export interface allBundlesQuery_allBundles {
  __typename: "AllBundlesOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  bundles: allBundlesQuery_allBundles_bundles[] | null;
}

export interface allBundlesQuery {
  allBundles: allBundlesQuery_allBundles;
}

export interface allBundlesQueryVariables {
  input: AllBundlesInput;
}
