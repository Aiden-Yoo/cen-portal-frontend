import { gql, useQuery } from '@apollo/client';
import {
  allDocumentsQuery,
  allDocumentsQueryVariables,
} from '../__generated__/allDocumentsQuery';

const ALL_FIRMWARES_QUERY = gql`
  query allDocumentsQuery($input: AllDocumentsInput!) {
    allDocuments(input: $input) {
      ok
      error
      totalPages
      totalResults
      documents {
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

export const useAllDocuments = (page?: number, take?: number) => {
  return useQuery<allDocumentsQuery, allDocumentsQueryVariables>(
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
