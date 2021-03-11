import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { useMutation } from '@apollo/client'

import { GET_TEST_EMAIL_GROUPS } from '../../api/queries'
import { CREATE_TEST_EMAIL_GROUP } from '../../api/mutations'
import Spinner from 'frontend/components/Spinner'

import Color from '../../utils/color'
import Spacing from '../../utils/spacing'

const StyledButton = styled.button({
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  background: transparentize(0.85, Color.PRIMARY),
  padding: `${Spacing.S3} ${Spacing.S4}`,
  color: Color.PRIMARY,
  marginBottom: 24,
  ':hover': {
    background: transparentize(0.75, Color.PRIMARY),
  }
})

const CreateTestGroupButton = () => {
  const [createTestEmailGroup, { loading, error }] = useMutation(
    CREATE_TEST_EMAIL_GROUP,
    {
      refetchQueries: [{ query: GET_TEST_EMAIL_GROUPS }],
    }
  )

  if (loading) return <Spinner />
  if (error) return 'Error!'

  return (
    <StyledButton onClick={createTestEmailGroup}>
      Create Test Group
    </StyledButton>
  )
}

export default CreateTestGroupButton
