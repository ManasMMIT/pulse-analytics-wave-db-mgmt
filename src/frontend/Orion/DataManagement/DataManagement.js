import React, { Component } from "react"
import XLSX from 'xlsx'

import Spinner from '../../Phoenix/shared/Spinner'

import SelectionFields from './SelectionFields'

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
      greatSuccess: false,
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

  handleSuccess = () => {
    this.fileInputRef.current.value = ''

    this.setState({ greatSuccess: true }, () => {
      setTimeout(() => {
        this.setState({
          sheetNames: [],
          isLoading: false,
          selectedSheet: null,
          selectedCollection: null,
          greatSuccess: false,
        })
      }, 1500)
    })
  }

  render() {
    const {
      sheetNames,
      selectedSheet,
      isLoading,
      selectedCollection,
      greatSuccess,
    } = this.state

    return (
      <div style={{ padding: 24 }}>
        <div>
          <p>Pick an Excel file:</p>
          <label style={{
            display: 'block',
            border: '1px solid black',
            borderRadius: 4,
            padding: '100px 200px',
            textAlign: 'center',
          }}>
            Import File
            <input
              style={{ display: 'none' }}
              ref={this.fileInputRef}
              type="file"
              multiple
              onChange={this.onFilesAdded}
            />
          </label>
        </div>

        {
          !greatSuccess
            ? (
              <SelectionFields
                workbook={this.workbook}
                sheetNames={sheetNames}
                selectedSheet={selectedSheet}
                selectedCollection={selectedCollection}
                handleSuccess={this.handleSuccess}
                handleSheetSelection={this.handleSheetSelection}
                handleCollectionSelection={this.handleCollectionSelection}
              />
            )
            : <div>IMPORT SUCCESSFUL</div>
        }
        {isLoading && <Spinner />}
      </div>
    )
  }
}


export default DataManagement
