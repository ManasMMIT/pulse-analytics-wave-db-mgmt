import React from 'react'
import styled from '@emotion/styled'
import { useAuth0 } from "../react-auth0-spa";
import { transparentize } from 'polished'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'
import UserProfile from './UserProfile'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"

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
  opacity: 0.6,
  ':hover': {
    background: transparentize(0.92, Colors.WHITE),
  }
})

const sidebarBottomSectionStyle = {
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const logoutButtonStyle = {
  cursor: 'pointer',
  padding: Spacing.NORMAL,
}

const LogoutContainer = styled.div({
  borderRadius: 4,
  margin: `${Spacing.NORMAL} ${Spacing.TINY} 0`,
  opacity: 0.6,
  ':hover': {
    background: transparentize(0.92, Colors.WHITE),
    opacity: 1,
  }
})

const SupportDocumentationContainer = styled.a({
  borderRadius: 4,
  margin: `0 ${Spacing.TINY} ${Spacing.TINY}`,
  opacity: 0.6,
  ':hover': {
    background: transparentize(0.92, Colors.WHITE),
    opacity: 1,
  }
})

const App = () => {
  const { loading, isAuthenticated, loginWithRedirect, logout, accessToken } = useAuth0()

  const logoutWithRedirect = () => logout({
    returnTo: window.location.origin
  })

  if (loading) return null

  if (!isAuthenticated) {
    const { location: { pathname, search } } = window
    loginWithRedirect({ appState: { targetUrl: pathname + search } })
    return
  }

  const client = new ApolloClient({
    uri: '/api/graphql',
    clientState: {
      resolvers,
      typeDefs,
    },
    request: operation => {
      operation.setContext(context => ({
        headers: {
          ...context.headers,
          Authorization: `Bearer ${accessToken}` || null,
        },
      })
      );
    },
    onError: errors => {
      const { networkError } = errors

      if (
        networkError
        && networkError.result
        && networkError.result.message === 'jwt expired'
      ) {
        localStorage.clear()
        client.clearStore().then(logoutWithRedirect)
      }
    }
  })

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
                <img style={iconStyle} src={IconSource. DELPHI} />
              </StyledNavLink>

              <div style={sidebarBottomSectionStyle}>
                <UserProfile />
                <LogoutContainer title="Log Out">
                  <FontAwesomeIcon
                    style={logoutButtonStyle}
                    onClick={() => {
                      localStorage.clear()
                      client.clearStore().then(logoutWithRedirect)
                    }}
                    icon={faSignOutAlt}
                    color={Colors.WHITE}
                  />
                </LogoutContainer>
                <SupportDocumentationContainer
                  href="https://dedhamgroup.atlassian.net/servicedesk/customer/portal/2/topic/6163d9cf-df29-498b-9c5a-40300462eb76"
                  target="_blank"
                  title="Polaris Support Documentation for TDG"
                >
                  <FontAwesomeIcon
                    style={logoutButtonStyle}
                    icon={faQuestionCircle}
                    color={Colors.WHITE}
                  />
                </SupportDocumentationContainer>
              </div>
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
