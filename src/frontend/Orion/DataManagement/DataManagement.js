import React, { Component } from "react"
import { Query, Mutation } from 'react-apollo'
import _ from 'lodash'
import XLSX from 'xlsx'
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

class DataManagement extends Component {
  constructor(props) {
    super(props)

    this.fileInputRef = React.createRef()

    this.workbook = null
    this.jsonForImport = []

    this.state = {
      sheetNames: [],
      isLoading: false,
      selectedSheet: null,
      selectedCollection: null,
    }
  }

  handleSheetSelection = selectedSheet => {
    this.setState({ selectedSheet })
  }

  handleCollectionSelection = selectedCollection => {
    this.setState({ selectedCollection })
  }

  onFilesAdded = () => {
    this.setState({ isLoading: true }, () => {
      const file = this.fileInputRef.current.files[0]

      const reader = new FileReader()

      reader.onload = e => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        this.workbook = workbook

        const sheetNames = workbook.SheetNames
        const selectedSheet = { value: sheetNames[0], label: sheetNames[0] }

        this.setState({
          sheetNames,
          isLoading: false,
          selectedSheet,
        })
      }

      reader.readAsArrayBuffer(file)
    })
  }

  render() {
    const {
      sheetNames,
      selectedSheet,
      isLoading,
      selectedCollection,
    } = this.state

    return (
      <div style={{ padding: 24 }}>
        <div>
          <p>Pick an Excel file:</p>
          <input
            ref={this.fileInputRef}
            type="file"
            multiple
            onChange={this.onFilesAdded}
          />
        </div>

        {
          _.isEmpty(sheetNames) || (
            <div style={{ marginTop: 24, width: 500 }}>
              <p>Sheets to Upload:</p>
              {
                <Select
                  value={selectedSheet}
                  onChange={this.handleSheetSelection}
                  options={this.state.sheetNames.map(n => ({ value: n, label: n }))}
                />
              }
            </div>
          )
        }

        {
          selectedSheet && (
            <div style={{ marginTop: 24 }}>
              <p>Which collection which you like to upload to?</p>
              <p>Create a blank collection or pick an existing collection to overwrite.</p>
              <Query query={GET_RAW_COLLECTION_NAMES}>
                {({ data: { collections }, loading, error }) => {
                  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
                  if (loading) return <Spinner />

                  return (
                    <CreatableSelect
                      onChange={this.handleCollectionSelection}
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
            <Mutation mutation={UPLOAD_COLLECTION}>
              {(handleUpload, { loading, error }) => {
                if (loading) return <Spinner />

                const { selectedSheet, selectedCollection } = this.state

                // TODO: Make error handling less wonky
                const errors = error && error.graphQLErrors[0].extensions.exception.error

                const selectedSheetObj = this.workbook.Sheets[selectedSheet.value]
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
        {isLoading && <Spinner />}
      </div>
    )
  }
}


export default DataManagement
