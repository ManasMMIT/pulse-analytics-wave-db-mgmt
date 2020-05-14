import React from "react"
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'
import { lighten, darken } from 'polished'

import Spinner from 'frontend/components/Spinner'

import {
  UPLOAD_COLLECTION,
} from '../../../api/mutations'

import { Colors, Spacing } from '../../../utils/pulseStyles'

const sharedButtonStyle = {
  background: Colors.PRIMARY,
  border: 'none',
  borderRadius: 4,
  color: Colors.WHITE,
  fontSize: 12,
  fontWeight: 700,
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
}

const Button = styled.button({
  ...sharedButtonStyle,
  ':hover': {
    background: lighten(0.1, Colors.PRIMARY),
  },
  ':active': {
    background: darken(0.1, Colors.PRIMARY),
    outline: 'none',
  }
})

const DisabledButton = styled.button({
  ...sharedButtonStyle,
  cursor: 'not-allowed',
  opacity: 0.4,
})

const SubmitButton = ({
  data,
  selectedCollection,
  selectedSheet,
  handleSuccess,
  handleError,
  handleClick,
  clicked,
}) => {
  const [handleUpload, { loading, error }] = useMutation(
    UPLOAD_COLLECTION,
    { update: handleSuccess },
  )
  if (loading) return <Spinner />

  // TODO: Make error handling less wonky
  let errors
  if (error && clicked) {
    errors = error.graphQLErrors[0].extensions.exception.error

    handleError(errors)
  }

  const isDisabled = _.isEmpty(data) || !selectedCollection || !selectedSheet

  const handleSubmit = () => {
    handleClick(true)

    handleUpload({
      variables: {
        input: {
          data,
          collectionName: selectedCollection.value,
        }
      }
    })
  }
  const StyledButton = isDisabled
    ? DisabledButton
    : Button

  return (
    <>
      <div style={{ marginTop: 24 }}>
        <StyledButton
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Import Sheet
        </StyledButton>
        {error && <span style={{ color: 'red', marginLeft: 24 }}>IMPORT FAILED</span>}
      </div>
    </>
  )
}

export default SubmitButton
