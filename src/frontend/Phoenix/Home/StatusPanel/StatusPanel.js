/*
  ? The PushToDevButton will likely be brought back for admin use,
    ? so it has not been removed, only commented out.
*/

import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import superUsersById from '../../../utils/super-users'
import { useAuth0 } from '../../../../react-auth0-spa'
import { Colors, Spacing } from '../../../utils/pulseStyles'

// import PushToDevButton from './PushToDevButton'
import PushToProdButton from './PushToProdButton'
import OpLog from './OpLog'

const wrapperPadding = Spacing.LARGE

const Wrapper = styled.div({
  backgroundColor: Colors.TOOL_SIDEBAR,
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  maxWidth: 256,
  overflowY: 'scroll',
  padding: wrapperPadding,
  textAlign: 'left',
})

const Header = styled.h3({
  color: Colors.WHITE,
  fontWeight: 600,
  fontSize: 14,
  marginTop: 0,
})

const paragraphStyle = {
  color: transparentize(0.2, Colors.WHITE),
  fontSize: 12,
  fontWeight: 400,
  lineHeight: 1.6,
}

const Paragraph = styled.p({
  ...paragraphStyle,
  marginBottom: Spacing.LARGE,
})

const TextLink = styled.a({
  ...paragraphStyle,
  ":visited": {
    color: Colors.WHITE,
  }
})

const StyledButton = styled.button({
  border: 'none',
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  padding: `${Spacing.SMALL}`,
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  },
  background: transparentize(0.85, Colors.WHITE),
  color: Colors.WHITE,
  ':hover': {
    background: transparentize(0.7, Colors.WHITE),
  }
})

const StatusPanel = () => {
  const { user } = useAuth0()
  const isSuperUser = user.sub in superUsersById

  return (
    <Wrapper>
      <div>
        <Header>Deploying Changes to Production</Header>
        <Paragraph>
          By default, changes automatically appear
          on <TextLink href="https://dev.pulse-tools.com/" target="_blank">dev.pulse-tools.com</TextLink> after you refresh the Pulse Analytics webapp. For clients to see the changes, click the button below to deploy the changes to production. <TextLink href="https://dedhamgroup.atlassian.net/wiki/spaces/TDG/pages/713129985/Phoenix+User+MGMT#Status-Panel" target="_blank">See guide for help.</TextLink>
        </Paragraph>
      </div>
      {/* <PushToDevButton /> */}
      <PushToProdButton />

      { process.env.NODE_ENV === 'production' && <OpLog /> }

      { 
        process.env.NODE_ENV === 'production' && isSuperUser && (
          <div style={{ margin: 'auto auto 0px' }}>
            <div style={{ marginTop: 16 }}>
              <Link
                to={`/phoenix/oplog`}
              >
                <StyledButton>
                  Full OpLog
                </StyledButton>
              </Link>
            </div>
          </div>
        )
      }
    </Wrapper>
  )
}

export default StatusPanel
