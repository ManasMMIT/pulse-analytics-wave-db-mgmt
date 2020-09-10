import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { PUSH_DEV_TO_PROD } from 'frontend/api/mutations'
import Spinner from 'frontend/components/Spinner'

import { CardContainer, CardTitle, PushButton } from './styledComponents'

const PushCard = ({ _id, name }) => {
  const [pushDevToProd, { loading: pushingData }] = useMutation(
    PUSH_DEV_TO_PROD,
    {
      variables: {
        input: {
          _id,
          isPushAll: false,
          name,
        },
      },
    }
  )

  return (
    <CardContainer>
      <CardTitle>{name}</CardTitle>
      <PushButton onClick={pushDevToProd}>
        {pushingData ? <Spinner fill="white" /> : 'Push to Prod'}
      </PushButton>
    </CardContainer>
  )
}

export default PushCard
