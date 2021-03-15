import React from 'react'
import styled from '@emotion/styled'
import { useAuth0 } from '../react-auth0-spa'
import { transparentize } from 'polished'
import { ApolloLink, HttpLink, ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { onError } from "@apollo/client/link/error"

import UserProfile from './UserProfile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSignOutAlt,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  NavLink,
  Switch,
} from 'react-router-dom'

import resolvers from './api/resolvers'
import typeDefs from './api/typeDefs'

import superUsersById from './utils/super-users'

import Home from './Home'
import Phoenix from './Phoenix'
import Orion from './Orion'
import Delphi from './Delphi'
import Icon from 'frontend/components/Icon'

import PayerProjectsList from './PayerProjects/PayerProjectsList'
import PayerProject from './PayerProjects/PayerProject'
import PayerLivesImport from './PayerProjects/PayerLivesImport'

import { Spacing } from './utils/pulseStyles'
import Color from './utils/color'

const SIDE_BAR_ITEMS = [
  {
    to: '/',
    exact: true,
    iconId: 'home-1-white',
    activeColor: Color.PRIMARY,
  },
  {
    to: '/phoenix',
    exact: false,
    iconId: 'phoenix-1-white',
    activeColor: Color.PHOENIX,
  },
  {
    to: '/orion',
    exact: false,
    iconId: 'orion-1-white',
    activeColor: Color.ORION,
  },
  {
    to: '/payer-projects',
    exact: false,
    iconId: 'payer-1-white',
    activeColor: Color.PAYER_PROJECTS,
  },
  {
    to: '/delphi',
    exact: false,
    iconId: 'mercury-1-white',
    activeColor: Color.DELPHI,
  },
]

const ICON_SIZE = 20

const getActiveLinkStyle = (activeColor) => ({
  background: transparentize(0.8, activeColor),
  opacity: 1,
})

const StyledNavLink = styled(NavLink)({
  color: Color.WHITE,
  borderRadius: 4,
  textDecoration: 'none',
  padding: `${Spacing.NORMAL} ${Spacing.NORMAL} ${Spacing.SMALL}`,
  margin: Spacing.TINY,
  opacity: 0.6,
  ':hover': {
    background: transparentize(0.92, Color.WHITE),
  },
})

const sidebarNavlinks = SIDE_BAR_ITEMS.map(
  ({ to, iconId, activeColor, exact }) => (
    <StyledNavLink
      key={to}
      exact={exact}
      to={to}
      activeStyle={getActiveLinkStyle(activeColor)}
    >
      <Icon width={ICON_SIZE} height={ICON_SIZE} iconName={iconId} />
    </StyledNavLink>
  )
)

const PolarisSidebar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#0E2539',
  padding: Spacing.TINY,
})

const sidebarBottomSectionStyle = {
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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
    background: transparentize(0.92, Color.WHITE),
    opacity: 1,
  },
})

const SupportDocumentationContainer = styled.a({
  borderRadius: 4,
  margin: `0 ${Spacing.TINY} ${Spacing.TINY}`,
  opacity: 0.6,
  ':hover': {
    background: transparentize(0.92, Color.WHITE),
    opacity: 1,
  },
})

const App = () => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    logout,
    accessToken,
    user,
  } = useAuth0()

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    })

  if (loading) return null

  if (!isAuthenticated) {
    const {
      location: { pathname, search },
    } = window
    loginWithRedirect({ appState: { targetUrl: pathname + search } })
    return
  }

  const httpLink = new HttpLink({
    uri: '/api/graphql',
  })

  const authLink = new ApolloLink((operation, forward) => {
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  })

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (
      networkError &&
      networkError.result &&
      networkError.result.message === 'jwt expired'
    ) {
      localStorage.clear()
      client.clearStore().then(logoutWithRedirect)
    }

    forward(operation)
  })

  const link = ApolloLink.from([
    authLink,
    errorLink,
    httpLink,
  ])

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    resolvers,
    typeDefs,
    link,
  })

  const isSuperUser = user.sub in superUsersById

  return (
    <ApolloProvider client={client}>
      <Router>
        <div style={{ display: 'flex', height: '100vh' }}>
          <PolarisSidebar>
            {sidebarNavlinks}
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
                  color={Color.WHITE}
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
                  color={Color.WHITE}
                />
              </SupportDocumentationContainer>
            </div>
          </PolarisSidebar>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/phoenix" component={Phoenix} />
            <Route path="/orion" component={Orion} />
            <Route path="/delphi" component={Delphi} />
            <Route exact path="/payer-projects" component={PayerProjectsList} />
            {isSuperUser ? (
              <Route
                path="/payer-projects/import-lives"
                component={PayerLivesImport}
              />
            ) : null}
            <Route path="/payer-projects/:projectId" component={PayerProject} />
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App
