import React from 'react'
import styled from '@emotion/styled'
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

import { Colors, Spacing } from './utils/pulseStyles'

const IconSource = {
  PHOENIX: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573136582/polaris/icons/phoenix-1-white.svg',
  ORION: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573136582/polaris/icons/orion-1-white.svg',
  DELPHI: 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573136582/polaris/icons/mercury-1-white.svg',
}

const client = new ApolloClient({
  uri: '/api/graphql',
  clientState: {
    resolvers,
    typeDefs,
  }
})

const PolarisSidebar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#0E2539',
  height: `calc(100vh - ${Spacing.SMALL})`,
  padding: Spacing.TINY,
})

const iconStyle = {
 width: 20,
 height: 20,
}

const activeLinkStyle = activeColor => ({
  background: transparentize(0.8, activeColor),
  opacity: 1,
})

const StyledNavLink = styled(NavLink)({
  color: Colors.WHITE,
  borderRadius: 4,
  textDecoration: 'none',
  padding: `${Spacing.NORMAL} ${Spacing.NORMAL} ${Spacing.SMALL}`,
  margin: Spacing.TINY,
  // borderLeft: '4px solid transparent',
  // borderRight: '4px solid transparent',
  opacity: 0.6,
  ':hover': {
    background: transparentize(0.92, Colors.WHITE),
  }
})

const App = () => {
  return (
    <ApolloProvider client={client}>
        <Router>
          <div style={{ display: 'flex' }}>
            <PolarisSidebar>
              <StyledNavLink
                to="/phoenix"
                activeStyle={activeLinkStyle(Colors.PHOENIX)}
              >
                <img style={iconStyle} src={IconSource.PHOENIX} />
              </StyledNavLink>
              <StyledNavLink
                to="/orion"
                activeStyle={activeLinkStyle(Colors.ORION)}
              >
                <img style={iconStyle} src={IconSource.ORION} />
              </StyledNavLink>
              <StyledNavLink
                to="/delphi"
                activeStyle={activeLinkStyle(Colors.DELPHI)}
              >
                <img style={iconStyle} src={IconSource.DELPHI} />
              </StyledNavLink>
            </PolarisSidebar>
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
