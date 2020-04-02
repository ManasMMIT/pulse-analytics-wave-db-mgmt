import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_PROJECT_PTPS } from '../../../../../../api/queries'

import Spinner from '../../../../../../Phoenix/shared/Spinner'

const ModalContent = ({ projectId }) => {
  const { data, loading } = useQuery(
    GET_PROJECT_PTPS,
    {
      variables: { 
        input: { projectId } 
      },
    })

  if (loading) return <Spinner />

  return (
    <div>Content</div>
  )
}

export default ModalContent