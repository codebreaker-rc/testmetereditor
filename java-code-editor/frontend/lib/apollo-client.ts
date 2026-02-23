import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';
import Cookies from 'js-cookie';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = Cookies.get('auth-token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
