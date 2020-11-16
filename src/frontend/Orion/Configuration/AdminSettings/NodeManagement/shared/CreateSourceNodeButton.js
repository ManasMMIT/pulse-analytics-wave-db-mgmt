import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'
import Modal from 'frontend/components/Modal'
import SaveButton from 'frontend/components/BusinessObjectModal/BusinessObjectModal/ButtonGroup/SaveButton'
import NodeForm from './NodeForm'

const CreateIcon = styled(FontAwesomeIcon)({
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

const CreateButton = styled.button({
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

const CreateSourceNodeButton = ({ type }) => {
  const [showModal, setShowModal] = useState(false)
  const [nodeFormData, setNodeFormData] = useState({ text: {} })

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
    setNodeFormData({ text: {} })
  }

  return (
    <>
      <CreateButton onClick={() => setShowModal(true)}>
        <CreateIcon size="lg" icon={faPlus} />
      </CreateButton>
      <Modal
        show={showModal}
        handleClose={handleModalClose}
        title={`Creating Source Node`}
        submitButton={<SaveButton save={() => {}} inFlight={false} />}
      >
        <NodeForm data={nodeFormData} setData={setNodeFormData} type={type} />
      </Modal>
    </>
  )
}

export default CreateSourceNodeButton
