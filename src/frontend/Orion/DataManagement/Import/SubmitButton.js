import React from "react"
import { Mutation } from 'react-apollo'

import Spinner from '../../../Phoenix/shared/Spinner'
import sheetToJson from './sheetToJson'

import ValidationErrors from '../ValidationErrors'

import {
  UPLOAD_COLLECTION,
} from '../../../api/mutations'

const SubmitButton = ({
  workbook,
  selectedCollection,
  handleSuccess,
  selectedSheet,
}) => (
  <>
    {
      selectedCollection && (
        <Mutation
          mutation={UPLOAD_COLLECTION}
          update={handleSuccess}
        >
          {(handleUpload, { loading, error }) => {
            if (loading) return <Spinner />

            // TODO: Make error handling less wonky
            const errors = error && error.graphQLErrors[0].extensions.exception.error

            const selectedSheetObj = workbook.Sheets[selectedSheet.value]
            const { json } = sheetToJson(selectedSheetObj)

            const handleSubmit = () => {
              handleUpload({
                variables: {
                  input: {
                    data: json,
                    collectionName: selectedCollection.value,
                  }
                }
              })
            }

            return (
              <>
                <div style={{ marginTop: 24 }}>
                  <button onClick={handleSubmit}>Upload</button>
                </div>
                {!!error && <ValidationErrors errors={errors} />}
              </>
            )
          }}
        </Mutation>
      )
    }
  </>
)

export default SubmitButton
