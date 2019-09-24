import React from "react"
import { Mutation } from 'react-apollo'

import Spinner from '../../../Phoenix/shared/Spinner'

import ValidationErrors from './ValidationErrors'

import {
  UPLOAD_COLLECTION,
} from '../../../api/mutations'

const SubmitButton = ({
  data,
  selectedCollection,
  handleSuccess,
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

            const handleSubmit = () => {
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
