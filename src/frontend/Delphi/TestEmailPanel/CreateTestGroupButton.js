import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { GET_TEST_EMAIL_GROUPS } from '../../api/queries'
import { CREATE_TEST_EMAIL_GROUP } from '../../api/mutations'
import Spinner from '../../Phoenix/shared/Spinner'

const buttonStyle = {
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  background: '#d4e2f2',
  color: '#1d66b8',
  marginBottom: 24,
}

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
    <button
      style={buttonStyle}
      onClick={createTestEmailGroup}
    >
      Create Test Group
    </button>
  )
}

export default CreateTestGroupButton
