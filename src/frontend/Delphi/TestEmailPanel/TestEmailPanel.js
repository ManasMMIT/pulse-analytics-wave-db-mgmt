import React from 'react'
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { lighten } from 'polished'

import TestEmailGroup from './TestEmailGroup'
import CreateTestGroupButton from './CreateTestGroupButton'
import { GET_TEST_EMAIL_GROUPS } from '../../api/queries'
import Spinner from 'frontend/components/Spinner'

import { Colors, Spacing } from '../../utils/pulseStyles'

const Wrapper = styled.div({
  background: lighten(0.05, Colors.LIGHT_GRAY_1),
  padding: Spacing.EXTRA_LARGE,
  height: '100vh',
  overflow: 'auto',
  boxSizing: 'border-box',
  flex: '1 0 auto',
})

const CardsContainer = styled.div({
  '& > :not(:last-child)': {
    marginBottom: 24,
  },
})

const TestEmailPanel = () => {
  const {
    data,
    loading,
    error,
  } = useQuery(GET_TEST_EMAIL_GROUPS)

  if (loading) return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <div>
        <p style={{ color: Colors.PRIMARY, fontSize: 12, fontWeight: 600, }}>
          Loading Test Emails
        </p>
        <Spinner size="32" />
      </div>
    </div>
  )
  if (error) return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <p style={{ color: Colors.RED, fontSize: 12, fontWeight: 600, lineHeight: '22px' }}>
        There was an error loading the Test Emails page.
        <br />
        Please reload the page. ⟲
      </p>
    </div>
  )

  const { testEmailGroups } = data

  return (
    <Wrapper>
      <CreateTestGroupButton />

      <CardsContainer>
        {
          testEmailGroups.map(({
            _id,
            name,
            recipients,
            usersToMock,
            emailSubscriptions,
          }) => {
            return (
              <TestEmailGroup
                key={_id}
                _id={_id}
                name={name || ''}
                recipients={recipients || []}
                usersToMock={usersToMock || []}
                emailSubscriptions={emailSubscriptions || []}
              />
            )
          })
        }
      </CardsContainer>
    </Wrapper>
  )
}

export default TestEmailPanel
