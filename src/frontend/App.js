import React from 'react'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RestLink } from 'apollo-link-rest'
import { Query, ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'

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

const GET_INITIAL_STATE = gql`
  query initialState {
    clients @rest(type: "Client", path: "/clients") {
      id
      name
      description
    }
    selectedClient @client {
      id
      name
      description
    }
    # teams @client {
    #   id
    #   name
    #   description
    # }
  }
`

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Query query={GET_INITIAL_STATE}>
        {({ loading, data }) => loading || <Phoenix data={data} />}
      </Query>
    </ApolloProvider>
  )
}

export default App
