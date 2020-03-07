import React from "react"
import XLSX from 'xlsx'
import _ from 'lodash'

import sheetToJson from './sheetToJson'

import Select from 'react-select'
import Spinner from '../../../Phoenix/shared/Spinner'

class Import extends React.Component {
  constructor(props) {
    super(props)

    this.fileInputRef = React.createRef()

    this.workbook = null
    this.jsonForImport = []

    this.state = {
      sheetNames: [],
      isLoading: false,
      selectedSheet: null,
    }
  }

  handleSheetSelection = selectedSheet => {
    this.setState({ selectedSheet })
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

  submitHandler = () => {
    const { selectedSheet } = this.state

    this.setState({ isLoading: true }, () => {
      const selectedSheetObj = this.workbook.Sheets[selectedSheet.value]
      const { json, numExcludedRows } = sheetToJson(selectedSheetObj)

      debugger

      // fetch('upload', {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ data: json, collectionName: selectedCollection.value }),
      // }).then(res => res.json())
      //   .then(persistedData => {
      //     const numberOfRows = persistedData.length

      //     this.setState({ isLoading: false }, () => {
      //       alert(`${numberOfRows} rows uploaded; ${numExcludedRows} rows excluded`)
      //     })
      //   })

      this.setState({ isLoading: false }, () => {
        alert(`${json.length} rows would be imported; ${numExcludedRows} rows excluded`)
      })
    })
  }

  render() {
    const {
      sheetNames,
      selectedSheet,
      isLoading,
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
            <button onClick={this.submitHandler}>
              Import
            </button>
          )
        }

        {isLoading && <Spinner />}
      </div>
    )
  }
}

export default Import
