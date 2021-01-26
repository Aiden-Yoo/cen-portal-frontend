/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllBundlesInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: tempallBundlesQuery
// ====================================================

export interface tempallBundlesQuery_allBundles_bundles {
  __typename: "Bundle";
  id: number;
  name: string;
  series: string | null;
}

export interface tempallBundlesQuery_allBundles {
  __typename: "AllBundlesOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  bundles: tempallBundlesQuery_allBundles_bundles[] | null;
}

export interface tempallBundlesQuery {
  allBundles: tempallBundlesQuery_allBundles;
}

export interface tempallBundlesQueryVariables {
  input: AllBundlesInput;
}
