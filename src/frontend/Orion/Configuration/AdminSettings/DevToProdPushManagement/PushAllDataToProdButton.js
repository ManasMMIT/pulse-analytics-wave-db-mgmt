import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { PUSH_DEV_TO_PROD } from 'frontend/api/mutations'
import Spinner from 'frontend/components/Spinner'

import { StyledTopButton } from './styledComponents'

const PushAllDataToProdButton = () => {
  const [pushAllDataToProd, { loading, error }] = useMutation(
    PUSH_DEV_TO_PROD,
    {
      variables: {
        input: {
          isPushAll: true,
          name: 'Push All Dev Data to Prod',
        },
      },
    }
  )

  if (loading) return <Spinner />
  if (error) return 'Error pushing all data!'

  return (
    <StyledTopButton onClick={pushAllDataToProd}>
      Push All Data to Prod
    </StyledTopButton>
  )
}

export default PushAllDataToProdButton
