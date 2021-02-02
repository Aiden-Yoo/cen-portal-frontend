import { gql, useQuery } from '@apollo/client';
import {
  allPartnersQuery,
  allPartnersQueryVariables,
} from '../__generated__/allPartnersQuery';

const ALL_PARTNERS_QUERY = gql`
  query allPartnersQuery($input: AllPartnersInput!) {
    allPartners(input: $input) {
      ok
      error
      totalPages
      totalResults
      partners {
        id
        name
        address
        zip
        tel
        contactsCount
        contacts {
          id
          name
          jobTitle
          tel
        }
      }
    }
  }
`;

export const useAllPartners = (page?: number, take?: number) => {
  return useQuery<allPartnersQuery, allPartnersQueryVariables>(
    ALL_PARTNERS_QUERY,
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
