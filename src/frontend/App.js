import React from 'react'

import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RestLink } from 'apollo-link-rest'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import resolvers from './api/resolvers'
import typeDefs from './api/typeDefs'
import Phoenix from './Phoenix'

const cache = new InMemoryCache()

const restLink = new RestLink({ uri: '/api' })
const httpLink = new HttpLink({ uri: '/api/graphql' })

const link = ApolloLink.from([
  restLink,
  httpLink,
]);

const client = new ApolloClient({
  cache,
  link,
  resolvers,
  typeDefs,
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route path="/" component={Phoenix} />
      </Router>
    </ApolloProvider>
  )
}

export default App
