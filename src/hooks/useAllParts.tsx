import { gql, useQuery } from '@apollo/client';
import {
  allPartsQuery,
  allPartsQueryVariables,
} from '../__generated__/allPartsQuery';

const ALL_PARTS_QUERY = gql`
  query allPartsQuery($input: AllPartsInput!) {
    allParts(input: $input) {
      ok
      error
      totalPages
      totalResults
      parts {
        id
        name
        series
        description
      }
    }
  }
`;

export const useAllParts = (page?: number, take?: number) => {
  return useQuery<allPartsQuery, allPartsQueryVariables>(ALL_PARTS_QUERY, {
    variables: {
      input: {
        page,
        take,
      },
    },
  });
};
