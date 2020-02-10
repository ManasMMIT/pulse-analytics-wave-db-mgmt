/*
  ? The PushToDevButton will likely be brought back for admin use,
    ? so it has not been removed, only commented out.
*/

import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../../../utils/pulseStyles'

// import PushToDevButton from './PushToDevButton'
import PushToProdButton from './PushToProdButton'
import StatusHeaderIcon from './StatusHeaderIcon'

const wrapperPadding = Spacing.LARGE

const Wrapper = styled.div({
  flex: 1,
  padding: wrapperPadding,
  overflowY: 'scroll',
  backgroundColor: Colors.TOOL_SIDEBAR,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  maxWidth: 200
})

const IconContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: Spacing.LARGE,
})

const Header = styled.h3({
  color: Colors.WHITE,
  fontWeight: 600,
  fontSize: 14,
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

const List = styled.ul({
  listStylePosition: 'outside',
  paddingInlineStart: wrapperPadding,
})

const ListItem = styled.li({
  ...paragraphStyle,
  marginBottom: Spacing.NORMAL,
})

const StatusPanel = () => (
  <Wrapper>
    <div>
      <IconContainer>
        <StatusHeaderIcon />
      </IconContainer>
      <Header>Deploying Changes to Prod</Header>
      <Paragraph>
        By default, changes made on Phoenix automatically appear
        on <TextLink href="https://dev.pulse-tools.com/" target="_blank">dev.pulse-tools.com</TextLink> when you refresh the page.
      </Paragraph>
      <Paragraph>
        Deploy permission changes to the production site via the button below if you have done any of the following actions:
      </Paragraph>
      <List>
        <ListItem>Create, edit, or delete a user, including modifying their team(s)</ListItem>
        <ListItem>Create, edit, or delete a team</ListItem>
        <ListItem>Edit team's permissions</ListItem>
      </List>
    </div>
    {/* <PushToDevButton /> */}
    <PushToProdButton />
  </Wrapper>
)

export default StatusPanel
