import { gql, useQuery } from '@apollo/client';
import {
  allFirmwaresQuery,
  allFirmwaresQueryVariables,
} from '../__generated__/allFirmwaresQuery';

const ALL_FIRMWARES_QUERY = gql`
  query allFirmwaresQuery($input: AllFirmwaresInput!) {
    allFirmwares(input: $input) {
      ok
      error
      totalPages
      totalResults
      firmwares {
        id
        writer {
          id
          name
          company
        }
        locked
        kind
        title
        files {
          id
          path
        }
        createAt
        updateAt
      }
    }
  }
`;

export const useAllFirmwares = (page?: number, take?: number) => {
  return useQuery<allFirmwaresQuery, allFirmwaresQueryVariables>(
    ALL_FIRMWARES_QUERY,
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
