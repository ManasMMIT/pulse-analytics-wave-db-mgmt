import React from 'react'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RestLink } from 'apollo-link-rest'
import { ApolloProvider } from 'react-apollo'

import resolvers from './resolvers'
import typeDefs from './typeDefs'
import Phoenix from './Phoenix'

const cache = new InMemoryCache()

const restLink = new RestLink({ uri: 'api' })

const client = new ApolloClient({
  cache,
  link: restLink,
  resolvers,
  typeDefs,
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Phoenix />
    </ApolloProvider>
  )
}

export default App
