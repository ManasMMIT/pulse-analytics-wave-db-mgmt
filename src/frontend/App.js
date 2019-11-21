import React from 'react'
import { transparentize } from 'polished'
import { ApolloProvider } from '@apollo/react-hooks'
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
import Taurus from './Taurus'

const IconSource = {
  PHOENIX: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573136582/polaris/icons/phoenix-1-white.svg',
  ORION: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573136582/polaris/icons/orion-1-white.svg',
  DELPHI: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573136582/polaris/icons/mercury-1-white.svg',
  TAURUS: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1574189853/polaris/icons/taurus-1-white.svg'
}

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
  padding: '24px 24px',
  borderLeft: '4px solid transparent',
  borderRight: '4px solid transparent',
  opacity: 0.7,
}

const iconStyle = {
 width: 20,
 height: 'auto',
}

const activeLinkStyle = borderColor => ({
  borderLeft: `4px solid ${ borderColor }`,
  background: transparentize(0.92, '#FFF'),
  opacity: 1,
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
                activeStyle={activeLinkStyle('#FA8969')}
              >
                <img style={iconStyle} src={IconSource.PHOENIX} />
              </NavLink>
              <NavLink
                to="/orion"
                style={linkStyle}
                activeStyle={activeLinkStyle('#38B59A')}
              >
                <img style={iconStyle} src={IconSource.ORION} />
              </NavLink>
              <NavLink
                to="/delphi"
                style={linkStyle}
                activeStyle={activeLinkStyle('#30B2DC')}
              >
                <img style={iconStyle} src={IconSource.DELPHI} />
              </NavLink>
              <NavLink
                to="/taurus"
                style={linkStyle}
                activeStyle={activeLinkStyle('#3B4DF7')}
              >
                <img style={iconStyle} src={IconSource.TAURUS} />
              </NavLink>
            </div>
            <Switch>
              <Route path="/phoenix" component={Phoenix} />
              <Route path="/orion" component={Orion} />
              <Route path="/delphi" component={Delphi} />
              <Route path="/taurus" component={Taurus} />
              <Redirect to="/phoenix" />
            </Switch>
          </div>
        </Router>
    </ApolloProvider>
  )
}

export default App
