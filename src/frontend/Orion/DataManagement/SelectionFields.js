import React, { Component } from "react"
import { Query, Mutation } from 'react-apollo'
import _ from 'lodash'

import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

import Spinner from '../../Phoenix/shared/Spinner'
import sheetToJson from './sheetToJson'

import ValidationErrors from './ValidationErrors'

import {
  GET_RAW_COLLECTION_NAMES,
} from './../../api/queries'

import {
  UPLOAD_COLLECTION,
} from './../../api/mutations'

const SelectionFields = ({
  workbook,
  sheetNames,
  selectedCollection,
  handleSuccess,
  selectedSheet,
  handleSheetSelection,
  handleCollectionSelection,
}) => (
  <div style={{ padding: 24 }}>
    {
      (_.isEmpty(sheetNames) || (
        <div style={{ marginTop: 24, width: 500 }}>
          <p>Sheets to Upload:</p>
          {
            <Select
              value={selectedSheet}
              onChange={handleSheetSelection}
              options={sheetNames.map(n => ({ value: n, label: n }))}
            />
          }
        </div>
      ))
    }
    {
      selectedSheet && (
        <div style={{ marginTop: 24 }}>
          <p>Which collection would you like to upload to?</p>
          <p>Create a blank collection or pick an existing collection to overwrite.</p>
          <Query query={GET_RAW_COLLECTION_NAMES}>
            {({ data: { collections }, loading, error }) => {
              if (error) return <div style={{ color: 'red' }}>Error processing request</div>
              if (loading) return <Spinner />

              return (
                <CreatableSelect
                  onChange={handleCollectionSelection}
                  options={collections.map(n => ({ value: n, label: n }))}
                  value={selectedCollection}
                />
              )
            }}
          </Query>
        </div>
      )
    }
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
  </div>
)

export default SelectionFields
