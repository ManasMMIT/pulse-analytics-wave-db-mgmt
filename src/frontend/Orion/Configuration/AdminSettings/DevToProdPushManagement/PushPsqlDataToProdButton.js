import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { PSQL_PUSH_CORE_TO_PROD } from 'frontend/api/mutations'
import Spinner from 'frontend/components/Spinner'

import { StyledTopButton } from './styledComponents'

const PushPsqlDataToProdButton = () => {
  const [pushPsqlCoreToProd, { loading, error }] = useMutation(
    PSQL_PUSH_CORE_TO_PROD
  )

  if (loading) return <Spinner />
  if (error) return 'Error pushing psql data!'

  return (
    <StyledTopButton onClick={pushPsqlCoreToProd}>
      Push Vega Data
    </StyledTopButton>
  )
}

export default PushPsqlDataToProdButton
