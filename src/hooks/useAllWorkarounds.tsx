import { gql, useQuery } from '@apollo/client';
import {
  allWorkaroundsQuery,
  allWorkaroundsQueryVariables,
} from '../__generated__/allWorkaroundsQuery';

const ALL_WORKAROUNDS_QUERY = gql`
  query allWorkaroundsQuery($input: AllWorkaroundsInput!) {
    allWorkarounds(input: $input) {
      ok
      error
      totalPages
      totalResults
      workarounds {
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
        commentsNum
      }
    }
  }
`;

export const useAllWorkarounds = (page?: number, take?: number) => {
  return useQuery<allWorkaroundsQuery, allWorkaroundsQueryVariables>(
    ALL_WORKAROUNDS_QUERY,
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
