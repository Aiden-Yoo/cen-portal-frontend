import { gql, useQuery } from '@apollo/client';
import {
  allIssuesQuery,
  allIssuesQueryVariables,
} from '../__generated__/allIssuesQuery';

const ALL_ISSUES_QUERY = gql`
  query allIssuesQuery($input: AllIssuesInput!) {
    allIssues(input: $input) {
      ok
      error
      totalPages
      totalResults
      issues {
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

export const useAllCases = (page?: number, take?: number) => {
  return useQuery<allIssuesQuery, allIssuesQueryVariables>(ALL_ISSUES_QUERY, {
    variables: {
      input: {
        page,
        take,
      },
    },
  });
};
