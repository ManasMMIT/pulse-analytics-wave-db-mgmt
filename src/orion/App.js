import React, { Component } from "react"
import _ from 'lodash'
import XLSX from 'xlsx'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import './spinner.css'
import sheetToJson from './sheetToJson'

class App extends Component {
  constructor(props) {
    super(props)

    this.fileInputRef = React.createRef()

    this.workbook = null
    this.jsonForImport = []

    this.state = {
      sheetNames: [],
      isLoading: false,
      selectedSheet: null,
      collectionNames: [],
      selectedCollection: null,
    }
  }

  componentDidMount() {
    fetch('collections')
      .then(res => res.json())
      .then(collectionNames => this.setState({ collectionNames }))
  }

  handleSheetSelection = selectedSheet => {
    this.setState({ selectedSheet })
  }

  handleCollectionSelection = selectedCollection => {
    this.setState({ selectedCollection })
  }

  handleCollectionCreation = collectionName => {
    fetch('collection', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionName }),
    }).then(res => res.text())
    .then(newCollectionName => {

      const collectionNames = _.cloneDeep(this.state.collectionNames)
      collectionNames.push(newCollectionName)

      this.setState({
        collectionNames,
        selectedCollection: { value: newCollectionName, label: newCollectionName },
      })
    })
  }

  submitHandler = () => {
    const { selectedSheet, selectedCollection } = this.state

    this.setState({ isLoading: true }, () => {
      const selectedSheetObj = this.workbook.Sheets[selectedSheet.value]
      const { json, numExcludedRows } = sheetToJson(selectedSheetObj)

      fetch('upload', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: json, collectionName: selectedCollection.value }),
      }).then(res => res.json())
        .then(persistedData => {
          const numberOfRows = persistedData.length

          this.setState({ isLoading: false }, () => {
            alert(`${numberOfRows} rows uploaded; ${numExcludedRows} rows excluded`)
          })
        })
    })
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

        this.setState({ sheetNames, isLoading: false })
      }

      reader.readAsArrayBuffer(file)
    })
  }

  render() {
    const {
      sheetNames,
      selectedSheet,
      isLoading,
      collectionNames,
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

              <CreatableSelect
                onChange={this.handleCollectionSelection}
                onCreateOption={this.handleCollectionCreation}
                options={collectionNames.map(n => ({ value: n, label: n }))}
                value={selectedCollection}
              />
            </div>
          )
        }

        {
          selectedCollection && (
            <div style={{ marginTop: 24 }}>
              <button onClick={this.submitHandler}>Upload</button>
            </div>
          )
        }

        {isLoading && <div className="spinner" />}
      </div>
    )
  }
}


export default App
