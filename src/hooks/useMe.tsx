import { gql, useQuery } from '@apollo/client';
import { meQuery } from '../__generated__/meQuery';

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      name
      company
      team
      jobTitle
      bio
      verified
      isLocked
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
