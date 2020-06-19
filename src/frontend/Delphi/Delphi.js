import React from 'react'
import { Route, Switch, Redirect, NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../utils/pulseStyles'

import SendEmailPanel from './SendEmailPanel'
import TestEmailPanel from './TestEmailPanel'
import EmailDashboardPanel from './EmailDashboardPanel'

const DelphiLogoSrc = 'https://res.cloudinary.com/pulsedatatools/image/upload/v1573837414/polaris/icons/mercury-1-color.svg'

const Wrapper = styled.div({
  backgroundColor: Colors.TOOL_SIDEBAR,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  height: '100vh',
  width: 256,
})

const DelphiHeader = styled.div({
  alignItems: 'center',
  background: transparentize(0.3, Colors.BLACK),
  color: Colors.DELPHI,
  display: 'flex',
  fontSize: 12,
  fontWeight: 700,
  marginBottom: Spacing.NORMAL,
  padding: `${Spacing.MEDIUM} ${Spacing.EXTRA_LARGE}`,
  textTransform: 'uppercase',
  width: '100%',
})

const DelphiLogo = styled.img({
  display: 'inline',
  marginRight: Spacing.SMALL,
})

const StyledNavLink = styled(NavLink)({
  ':hover': {
    background: transparentize(0.9, Colors.WHITE)
  }
})

const sharedStyles = {
  margin: `0 ${Spacing.NORMAL}`,
  borderRadius: 4,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
}

const inactiveLinkStyle = {
  color: transparentize(0.4, Colors.WHITE),
  ...sharedStyles,
}

const activeLinkStyle = {
  color: Colors.WHITE,
  background: transparentize(0.9, Colors.WHITE),
  ...sharedStyles,
}

const Delphi = () => (
  <div style={{ display: 'flex', flex: '1 0 auto' }}>
    <Wrapper>
      <DelphiHeader>
        <DelphiLogo src={DelphiLogoSrc} />
        Delphi Email Service
      </DelphiHeader>
      <StyledNavLink
        to="/delphi/test-emails"
        style={inactiveLinkStyle}
        activeStyle={activeLinkStyle}
      >
        Test Emails
      </StyledNavLink>
      <StyledNavLink
        to="/delphi/real-emails"
        style={inactiveLinkStyle}
        activeStyle={activeLinkStyle}
      >
        Client Emails
      </StyledNavLink>
      <StyledNavLink
        to="/delphi/dashboard"
        style={inactiveLinkStyle}
        activeStyle={activeLinkStyle}
      >
        Dashboard
      </StyledNavLink>
    </Wrapper>

    <Switch>
      <Route path="/delphi/test-emails" component={TestEmailPanel} />
      <Route path="/delphi/real-emails" component={SendEmailPanel} />
      <Route path="/delphi/dashboard" component={EmailDashboardPanel} />
      <Redirect to="/delphi/test-emails"  />
    </Switch>
  </div>
)

export default Delphi
