import React from "react"
import { Mutation } from 'react-apollo'
import styled from '@emotion/styled'
import _ from 'lodash'

import Spinner from '../../../Phoenix/shared/Spinner'

import {
  UPLOAD_COLLECTION,
} from '../../../api/mutations'

const Button = styled.button({
  border: 'none',
  background: '#006aff',
  color: 'white',
  fontWeight: 700,
  padding: 6,
  borderRadius: 3,
})

const DisabledButton = styled.button({
  border: 'none',
  background: '#006aff0f',
  color: '#00000033',
  fontWeight: 700,
  padding: 6,
  borderRadius: 3,
})

const SubmitButton = ({
  data,
  selectedCollection,
  selectedSheet,
  handleSuccess,
  handleError,
  handleClick,
  clicked,
}) => (
  <Mutation
    mutation={UPLOAD_COLLECTION}
    update={handleSuccess}
  >
    {(handleUpload, { loading, error }) => {
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
    }}
  </Mutation>
)

export default SubmitButton
