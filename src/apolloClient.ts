
// src/services/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_GRAPHQL_URL as string;
const DASHBOARD_KEY = import.meta.env.VITE_DASHBOARD_API_KEY as string;

if (!DASHBOARD_URL) throw new Error('Missing VITE_DASHBOARD_GRAPHQL_URL');
if (!DASHBOARD_KEY) throw new Error('Missing VITE_DASHBOARD_API_KEY');

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'x-api-key': DASHBOARD_KEY,
      'content-type': 'application/json',
    },
  });
  return forward(operation);
});

const httpLink = new HttpLink({ uri: DASHBOARD_URL });

export const dashboardClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
