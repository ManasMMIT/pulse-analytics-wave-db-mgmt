import React from 'react'
import { transparentize } from 'polished'
// import { ApolloClient } from 'apollo-client'
// import { ApolloLink } from 'apollo-link'
// import { InMemoryCache } from 'apollo-cache-inmemory'
// import { RestLink } from 'apollo-link-rest'
// import { HttpLink } from 'apollo-link-http'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  NavLink,
  Switch,
} from 'react-router-dom'

import resolvers from './api/resolvers'
import typeDefs from './api/typeDefs'
import Phoenix from './Phoenix'
import Orion from './Orion'
import Delphi from './Delphi'

// const cache = new InMemoryCache()

// const restLink = new RestLink({ uri: '/api' })
// const httpLink = new HttpLink({ uri: '/api/graphql' })

// const link = ApolloLink.from([
//   restLink,
//   httpLink,
// ]);

// const client = new ApolloClient({
//   cache,
//   link,
//   resolvers,
//   typeDefs,
// })

const client = new ApolloClient({
  uri: '/api/graphql',
  clientState: {
    resolvers,
    typeDefs,
  }
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
  padding: '24px 36px',
}

const activeLinkStyle = borderColor => ({
  borderLeft: `4px solid ${ transparentize(.3, borderColor) }`,
  padding: '24px 36px',
})

const App = () => {
  return (
    <ApolloProvider client={client}>
        <Router>
          <div style={{ display: 'flex' }}>
            <div style={sidebarStyle}>
              <NavLink
                to="/phoenix"
                style={linkStyle}
                activeStyle={activeLinkStyle('red')}
              >
                P
              </NavLink>
              <NavLink
                to="/orion"
                style={linkStyle}
                activeStyle={activeLinkStyle('green')}
              >
                O
              </NavLink>
              <NavLink
                to="/delphi"
                style={linkStyle}
                activeStyle={activeLinkStyle('lightblue')}
              >
                D
              </NavLink>
            </div>
            <Switch>
              <Route path="/phoenix" component={Phoenix} />
              <Route path="/orion" component={Orion} />
              <Route path="/delphi" component={Delphi} />
              <Redirect to="/phoenix" />
            </Switch>
          </div>
        </Router>
    </ApolloProvider>
  )
}

export default App
