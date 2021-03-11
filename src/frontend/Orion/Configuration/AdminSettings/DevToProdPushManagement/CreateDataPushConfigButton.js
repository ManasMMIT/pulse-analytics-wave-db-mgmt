import React from 'react'
import { useMutation } from '@apollo/client'

import { GET_DEV_TO_PROD_PUSH_CONFIGS } from 'frontend/api/queries'
import { CREATE_DEV_TO_PROD_PUSH_CONFIG } from 'frontend/api/mutations'
import Spinner from 'frontend/components/Spinner'

import { StyledTopButton } from './styledComponents'

const CreateDataPushConfigButton = () => {
  const [createDevToProdPushConfig, { loading, error }] = useMutation(
    CREATE_DEV_TO_PROD_PUSH_CONFIG,
    {
      refetchQueries: [{ query: GET_DEV_TO_PROD_PUSH_CONFIGS }],
    }
  )

  if (loading) return <Spinner />
  if (error) return 'Error!'

  return (
    <StyledTopButton onClick={createDevToProdPushConfig}>
      Create Config
    </StyledTopButton>
  )
}

export default CreateDataPushConfigButton
