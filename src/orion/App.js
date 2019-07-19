import React, { Component } from "react"
import _ from 'lodash'
import XLSX from 'xlsx'
import Select from 'react-select'
import './spinner.css'
// import sheetToJson from 'sheetToJson'
// const {
//   isEmptyRow,
//   sanitizeKeysAndTrimData,
//   getScriptTerminator
// } = require('../utils')
// const parseSchema = require('mongodb-schema')

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
    fetch('getCollections')
      .then(res => res.json())
      .then(collectionNames => this.setState({ collectionNames }))
  }

  handleSheetSelection = selectedSheet => {
    this.setState({ selectedSheet })
  }

  handleCollectionSelection = selectedCollection => {
    this.setState({ selectedCollection })
  }

  onFilesAdded = () => {
    this.setState({ isLoading: true })

    const file = this.fileInputRef.current.files[0]

    const reader = new FileReader()

    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, {type: 'array'})
      this.workbook = workbook

      const sheetNames = workbook.SheetNames

      this.setState({ sheetNames, isLoading: false })
    }

    reader.readAsArrayBuffer(file)
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
              <p>If the collection exists, it'll be overwritten. If not, a new collection will be created.</p>

              <Select
                value={selectedCollection}
                onChange={this.handleCollectionSelection}
                options={collectionNames.map(n => ({ value: n, label: n }))}
              />
            </div>
          )
        }

        {isLoading && <div className="spinner" />}
      </div>
    )
  }
}


export default App

        // var excelFile = document.getElementById("fileDemo").files[0];
        // var password = $("#password").val();

        // // here is excel IO API
        // excelIo.open(excelFile, function(json) {
        //     var workbookObj = json;

        //     spread.fromJSON(workbookObj);
        //   $('.spinner').hide()
        //   $('.wrap').css({visibility:'visible'})
