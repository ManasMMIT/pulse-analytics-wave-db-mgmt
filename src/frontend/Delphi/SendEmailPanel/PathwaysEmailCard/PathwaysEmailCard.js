import React from 'react'
import styled from '@emotion/styled'

import SendButton from '../../shared/SendButton'
import UsersTable from './UsersTable'
import { pathwaysEmailSubscription } from '../../../utils/email-subscription-options'

import {
  SEND_TO_SUBSCRIBED_USERS
} from './../../../api/mutations'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const Wrapper = styled.div({
  background: Colors.WHITE,
  borderRadius: 4,
  padding: Spacing.EXTRA_LARGE,
})

const EmailTitle = styled.h1({
  fontSize: 16,
  fontWeight: 600,
  margin: 0,
})

const Description = styled.p({
  fontSize: 12,
  lineHeight: '22px',
  maxWidth: 524,
})

const PathwaysEmailCard = () => {
  return (
    <Wrapper>
      <EmailTitle>Pathways Monthly Email</EmailTitle>
      <Description>
        The Pathways Monthly Email contains information for the selected month. The content is based on the user's permissions as defined in Phoenix. Prior to sending the client monthly email, send a test email to TDG to allow them the chance to QA and verify that the email content is correct.
      </Description>

      <div style={{ marginTop: 24 }}>
        <SendButton
          data={{
            input: {
              _id: pathwaysEmailSubscription._id,
            }
          }}
          mutationDoc={SEND_TO_SUBSCRIBED_USERS}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <UsersTable />
      </div>
    </Wrapper>
  )
}

export default PathwaysEmailCard
