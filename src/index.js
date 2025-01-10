import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';  // global styles
import App from './App';

// Apollo imports
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// 1) Create an HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://learn.reboot01.com/api/graphql-engine/v1/graphql', 
});

// 2) authLink adds the JWT as Bearer token to each request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // retrieve JWT from localStorage
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 3) Create the Apollo client with our authLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// 4) Render root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
