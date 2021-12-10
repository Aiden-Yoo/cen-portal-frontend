import {
  ApolloClient,
  InMemoryCache,
  makeVar,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  LOCALSTORAGE_TOKEN,
  WAS_IP,
  TOKEN_EXPIRED,
  FORBIDDEN_RESOURCE,
} from './constants';
import { notification } from 'antd';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: `http://${WAS_IP}:4000/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // 'x-jwt': authTokenVar() || '',
      // Authentication: `Bearer ${token}`,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path, extensions }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${path}`,
        );
        switch (message) {
          case FORBIDDEN_RESOURCE:
            localStorage.removeItem(LOCALSTORAGE_TOKEN);
            notification.error({
              message: 'Error',
              description: `[세션 만료] 다시 로그인 해주세요.`,
              placement: 'topRight',
              duration: 2,
            });
            setTimeout(() => {
              window.location.replace('/');
            }, 2000);
            break;
          case TOKEN_EXPIRED:
            notification.error({
              message: 'Error',
              description: `[에러 발생] 다시 시도 해주세요.`,
              placement: 'topRight',
              duration: 2,
            });
            break;
        }
      });
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  },
);

export const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
