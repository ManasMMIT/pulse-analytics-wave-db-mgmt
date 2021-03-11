import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/client'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'
import { transparentize, mix } from 'polished'

import { UPDATE_NODE } from 'frontend/api/mutations'
import { GET_SOURCE_NODES } from 'frontend/api/queries'
import { Colors, Spacing } from 'frontend/utils/pulseStyles'
import CloseButton from 'frontend/components/BusinessObjectModal/BusinessObjectModal/ButtonGroup/CloseButton'
import SaveButton from 'frontend/components/BusinessObjectModal/BusinessObjectModal/ButtonGroup/SaveButton'

import NodeForm from '../NodeForm'

const SWITCH_COLOR = Colors.GREEN

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

// Material UI Custom Switch Styling
const StyledSwitch = withStyles({
  switchBase: {
    color: mix(0.4, Colors.BLACK, Colors.WHITE),
    '&$checked': {
      color: SWITCH_COLOR,
    },
    '&$checked + $track': {
      backgroundColor: SWITCH_COLOR,
    },
  },
  checked: {},
  track: {
    backgroundColor: transparentize(0.7, Colors.BLACK),
  },
})(Switch)

const EditModalContent = ({ node, handleModalClose }) => {
  const { __typename, ...nodeFields } = node

  const [shouldCascadeChanges, setShouldCascadeChanges] = useState(false)
  const [nodeFormData, setNodeFormData] = useState(nodeFields)

  const input = {
    node: nodeFormData,
    cascade: shouldCascadeChanges,
  }

  const [save, { loading }] = useMutation(UPDATE_NODE, {
    variables: { input },
    refetchQueries: [{ query: GET_SOURCE_NODES }],
    onCompleted: handleModalClose,
    onError: (e) => alert(`Write failure: ${e.message}`),
    awaitRefetchQueries: true,
  })

  return (
    <>
      <ModalHeader>
        <ModalTitle>{`Editing Source Node / ${node.name}`}</ModalTitle>
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
      <div style={{ paddingLeft: Spacing.LARGE }}>
        <div>
          <label>Cascade changes to all role copies: </label>
          <StyledSwitch
            onChange={({ target: { checked } }) =>
              setShouldCascadeChanges(checked)
            }
            value={shouldCascadeChanges}
          />
        </div>
        {shouldCascadeChanges && (
          <div
            style={{
              color: Colors.RED,
              fontWeight: 700,
              textTransform: 'uppercase',
              textDecoration: 'underline',
            }}
          >
            Warning: All role & user sitemaps will be replaced entirely. Are you
            sure?
          </div>
        )}
      </div>
      <NodeForm data={nodeFormData} setData={setNodeFormData} />
    </>
  )
}

export default EditModalContent
