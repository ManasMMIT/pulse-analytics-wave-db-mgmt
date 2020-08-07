import React from 'react'
import styled from '@emotion/styled'

import Color from 'frontend/utils/color'

import Button from '../../Button'

const DeleteConfirmationContainer = styled.div({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  padding: 24,
  textAlign: 'center',
})

const DeleteMessageText = styled.p({
  color: Color.BLACK,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.5,
  marginBottom: 12,
})

const DeleteMessageBO = styled.span({
  color: Color.PRIMARY,
  fontWeight: 800,
})

const DeleteMessageCaption = styled.p({
  color: Color.RED,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.5,
  marginTop: 12,
})

const DeleteConfirmation = ({
  titleModifiers,
  deleteHandler,
  showDeleteConfirmation,
}) => {
  if (!showDeleteConfirmation) return null

  return (
    <DeleteConfirmationContainer>
      <div>
        <DeleteMessageText>
          Are you sure you want to delete{' '}
          <DeleteMessageBO>{titleModifiers}</DeleteMessageBO>?
        </DeleteMessageText>
        <DeleteMessageText>
          Any connections to <DeleteMessageBO>{titleModifiers}</DeleteMessageBO>{' '}
          will also be deleted.
        </DeleteMessageText>
      </div>
      <div style={{ marginTop: 24 }}>
        <Button
          color={Color.RED}
          iconName="delete"
          iconColor1={Color.WHITE}
          onClick={deleteHandler}
        >
          Delete Forever
        </Button>
        <DeleteMessageCaption>This cannot be undone.</DeleteMessageCaption>
      </div>
    </DeleteConfirmationContainer>
  )
}

export default DeleteConfirmation
