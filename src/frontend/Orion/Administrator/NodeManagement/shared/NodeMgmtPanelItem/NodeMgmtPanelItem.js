import React, { useState } from 'react'
import styled from '@emotion/styled'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { transparentize } from 'polished'

import { Colors } from 'frontend/utils/pulseStyles'

import {
  panelItemStyle,
  panelItemActiveStyle,
} from 'frontend/Phoenix/SitemapPanel/shared/panelStyles'

import EditModalButton from './EditModalButton'

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const StyledButtonLabel = styled.button({
  fontSize: 24,
  position: 'relative',
  top: 2,
  cursor: 'pointer',
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
  color: transparentize(0.7, Colors.BLACK),
  ':hover': {
    color: Colors.PRIMARY,
    background: transparentize(0.9, Colors.PRIMARY),
  },
})

const copyToClipboard = (nodeId) => {
  navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.writeText(nodeId)
    } else {
      console.log('permission DENIED')
    }
  })
}

const NodeMgmtPanelItem = ({ isSelected, handleClick, node }) => {
  const [snackbarOpen, toggleSnackbar] = useState(false)

  const activeStyleObj = isSelected ? panelItemActiveStyle : {}

  const finalStyle = {
    ...panelItemStyle,
    ...activeStyleObj,
    minHeight: 70,
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={snackbarOpen}
        onClose={() => toggleSnackbar(false)}
        autoHideDuration={2000}
      >
        <Alert onClose={() => toggleSnackbar(false)} severity="success">
          Node ID Copied
        </Alert>
      </Snackbar>
      <div onClick={handleClick} style={finalStyle}>
        <div>{node.name}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledButtonLabel
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(node._id)
              toggleSnackbar(true)
            }}
          >
            ⧉
          </StyledButtonLabel>
          {isSelected && <EditModalButton node={node} />}
        </div>
      </div>
    </>
  )
}

export default NodeMgmtPanelItem
