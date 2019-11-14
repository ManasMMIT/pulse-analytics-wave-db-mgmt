import React from 'react'
import { Route, Switch, Redirect, NavLink } from 'react-router-dom'
import styled from '@emotion/styled'

import SendEmailPanel from './SendEmailPanel'
import TestEmailPanel from './TestEmailPanel'

const Wrapper = styled.div({
  backgroundColor: 'rgb(10, 53, 87)',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  height: '100vh',
})

const sharedStyles = {
  padding: 24,
  textDecoration: 'none',
  fontWeight: 600,
}

const inactiveLinkStyle = {
  color: 'rgb(122, 151, 177)',
  borderLeft: '4px solid transparent',
  ...sharedStyles,
}

const activeLinkStyle = {
  color: 'rgb(235, 246, 251)',
  borderLeft: '4px solid rgb(15, 102, 208)',
  ...sharedStyles,
}

const Delphi = () => (
  <div style={{ display: 'flex', flex: '1 0 auto' }}>
    <Wrapper>
      <NavLink
        to="/delphi/test-emails"
        style={inactiveLinkStyle}
        activeStyle={activeLinkStyle}
      >
        T
      </NavLink>
      <NavLink
        to="/delphi/real-emails"
        style={inactiveLinkStyle}
        activeStyle={activeLinkStyle}
      >
        S
      </NavLink>
    </Wrapper>

    <Switch>
      <Route path="/delphi/test-emails" component={TestEmailPanel} />
      <Route path="/delphi/real-emails" component={SendEmailPanel} />
      <Redirect to="/delphi/test-emails"  />
    </Switch>
  </div>
)

export default Delphi
