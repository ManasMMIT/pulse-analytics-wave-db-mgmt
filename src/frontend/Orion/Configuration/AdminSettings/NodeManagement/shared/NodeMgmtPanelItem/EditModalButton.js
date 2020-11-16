import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'
import Modal from 'frontend/components/Modal'
import SaveButton from 'frontend/components/BusinessObjectModal/BusinessObjectModal/ButtonGroup/SaveButton'
import NodeForm from '../NodeForm'

const EditIcon = styled(FontAwesomeIcon)({
  border: 'none',
  background: 'none',
  padding: 12,
  cursor: 'pointer',
  borderRadius: 4,
  color: transparentize(0.7, Colors.BLACK),
  ':hover': {
    color: Colors.PRIMARY,
    background: transparentize(0.9, Colors.PRIMARY),
  },
})

const EditButton = styled.button({
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  ':active': {
    outline: 'none',
  },
  ':focus': {
    outline: 'none',
  },
})

const EditModalButton = ({ node }) => {
  const [showModal, setShowModal] = useState(false)
  const [nodeFormData, setNodeFormData] = useState(node)

  // const [save] = useMutation(UPDATE_TEAM_NODE, {
  //   variables: {
  //     input: {
  //       nodeData,
  //       teamId,
  //     }
  //   },
  //   refetchQueries,
  //   onCompleted: ({ updateSourceNode }) => {
  //     console.log(updateSourceNode)
  //     setData(updateSourceNode)
  //     alert('Write successful')
  //   },
  //   onError: e => alert(`Write failure: ${e.message}`),
  //   awaitRefetchQueries: true,
  // })

  const handleModalClose = () => {
    setShowModal(false)
    setNodeFormData(node)
  }

  return (
    <>
      <EditButton onClick={() => setShowModal(true)}>
        <EditIcon size="lg" icon={faEdit} />
      </EditButton>
      <Modal
        show={showModal}
        handleClose={handleModalClose}
        title={`Editing Source Node / ${node.name}`}
        submitButton={<SaveButton save={() => {}} inFlight={false} />}
      >
        <NodeForm data={nodeFormData} setData={setNodeFormData} />
      </Modal>
    </>
  )
}

export default EditModalButton
