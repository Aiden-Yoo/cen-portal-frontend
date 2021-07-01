import { gql, useQuery } from '@apollo/client';
import {
  allUsersQuery,
  allUsersQueryVariables,
} from '../__generated__/allUsersQuery';

const ALL_USERS_QUERY = gql`
  query allUsersQuery($input: AllUsersInput!) {
    allUsers(input: $input) {
      ok
      error
      totalPages
      totalResults
      users {
        id
        createAt
        email
        role
        company
        team
        name
        verified
        isLocked
      }
    }
  }
`;

export const useAllUsers = (page?: number, take?: number) => {
  return useQuery<allUsersQuery, allUsersQueryVariables>(ALL_USERS_QUERY, {
    variables: {
      input: {
        page,
        take,
      },
    },
  });
};
