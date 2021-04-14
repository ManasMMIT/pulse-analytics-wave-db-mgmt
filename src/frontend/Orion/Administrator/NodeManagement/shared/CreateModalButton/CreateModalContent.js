import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { Spacing } from 'frontend/utils/pulseStyles'
import CloseButton from 'frontend/components/BusinessObjectModal/BusinessObjectModal/ButtonGroup/CloseButton'
import SaveButton from 'frontend/components/BusinessObjectModal/BusinessObjectModal/ButtonGroup/SaveButton'
import { GET_SOURCE_NODES } from 'frontend/api/queries'
import { CREATE_NODE } from 'frontend/api/mutations'

import NodeForm from '../NodeForm'

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${Spacing.NORMAL} ${Spacing.NORMAL} ${Spacing.LARGE} ${Spacing.LARGE}`,
})

const ModalTitle = styled.div({
  display: 'flex',
  fontWeight: 700,
  fontSize: 20,
})

const handleUrlSelection = ({
  history,
  queryString,
  location,
  nodeId,
  nodeType,
}) => {
  const locationSearch =
    (location.search && queryString.parse(location.search)) || {}

  const TYPE_ORDER = ['tool', 'dashboard', 'page', 'card']

  const currentTypeIdx = TYPE_ORDER.findIndex((type) => type === nodeType)

  const childrenTypes = TYPE_ORDER.slice(currentTypeIdx + 1)

  childrenTypes.forEach((childType) => {
    delete locationSearch[`${childType}Id`]
  })

  const search = queryString.stringify({
    ...locationSearch,
    [`${nodeType}Id`]: nodeId,
  })

  history.push({ search })
}

const CreateModalContent = ({ type, handleModalClose }) => {
  const history = useHistory()
  const location = useLocation()
  const [nodeFormData, setNodeFormData] = useState({ text: {} })

  const input = {
    ...nodeFormData,
    type,
  }

  const [save, { loading }] = useMutation(CREATE_NODE, {
    variables: { input },
    refetchQueries: [{ query: GET_SOURCE_NODES }],
    onCompleted: ({ createNode }) => {
      handleModalClose()
      handleUrlSelection({
        history,
        queryString,
        location,
        nodeId: createNode._id,
        nodeType: type,
      })
    },
    onError: (e) => alert(`Write failure: ${e.message}`),
    awaitRefetchQueries: true,
  })

  return (
    <>
      <ModalHeader>
        <ModalTitle>{`Creating Source Node / ${type}`}</ModalTitle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CloseButton closeModal={handleModalClose} />
          <SaveButton save={save} inFlight={loading} />
        </div>
      </ModalHeader>
      <NodeForm data={input} setData={setNodeFormData} type={type} />
    </>
  )
}

export default CreateModalContent
