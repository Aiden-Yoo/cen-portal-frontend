import { gql, useQuery } from '@apollo/client';
import {
  allBundlesQuery,
  allBundlesQueryVariables,
} from '../__generated__/allBundlesQuery';

const ALL_BUNDLES_QUERY = gql`
  query allBundlesQuery($input: AllBundlesInput!) {
    allBundles(input: $input) {
      ok
      error
      totalPages
      totalResults
      bundles {
        id
        name
        series
        parts {
          id
          name
          num
        }
      }
    }
  }
`;

export const useAllBundles = (page?: number, take?: number) => {
  return useQuery<allBundlesQuery, allBundlesQueryVariables>(
    ALL_BUNDLES_QUERY,
    {
      variables: {
        input: {
          page,
          take,
        },
      },
    },
  );
};
