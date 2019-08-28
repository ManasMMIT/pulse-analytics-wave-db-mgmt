import React from 'react'

import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RestLink } from 'apollo-link-rest'
import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom'

import resolvers from './api/resolvers'
import typeDefs from './api/typeDefs'
import Phoenix from './Phoenix'
import Orion from './Orion'

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

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#0E2539',
  height: '100vh',
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
}

const App = () => {
  return (
    <ApolloProvider client={client}>
        <Router>
          <div style={{ display: 'flex' }}>
            <div style={sidebarStyle}>
              <div style={{ padding: 24 }}>
                <Link to="/phoenix" style={linkStyle}>P</Link>
              </div>
              <div style={{ padding: 24 }}>
                <Link to="/orion" style={linkStyle}>O</Link>
              </div>
            </div>

            <Route path="/phoenix" component={Phoenix} />
            <Route path="/orion" component={Orion} />
            <Redirect to="/phoenix" />
          </div>
        </Router>
    </ApolloProvider>
  )
}

export default App
