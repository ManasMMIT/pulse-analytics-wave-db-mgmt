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

      return (
        <>
          <div style={{ marginTop: 24 }}>
            <Button
              onClick={handleSubmit}
              disabled={_.isEmpty(data) || !selectedCollection || !selectedSheet}
            >
              Import Sheet
            </Button>
            {error && <span style={{ color: 'red', marginLeft: 24 }}>IMPORT FAILED</span>}
          </div>
        </>
      )
    }}
  </Mutation>
)

export default SubmitButton
