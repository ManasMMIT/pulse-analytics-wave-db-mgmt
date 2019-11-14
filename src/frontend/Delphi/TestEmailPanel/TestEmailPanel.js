import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import TestEmailGroup from './TestEmailGroup'
import CreateTestGroupButton from './CreateTestGroupButton'
import { GET_TEST_EMAIL_GROUPS } from '../../api/queries'

const Wrapper = styled.div({
  padding: 24,
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

  if (loading) return 'Loading...'
  if (error) return 'Error!'

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
