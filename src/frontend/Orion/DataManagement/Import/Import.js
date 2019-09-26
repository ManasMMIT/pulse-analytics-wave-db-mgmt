import React from "react"
import XLSX from 'xlsx'
import _ from 'lodash'

import sheetToJson from './sheetToJson'

import SheetSelector from './SheetSelector'
import CollectionSelector from './CollectionSelector'
import SubmitButton from './SubmitButton'
import Spinner from '../../../Phoenix/shared/Spinner'
import TreatmentPlanManager from './TreatmentPlanManager'

import Card from '../../../components/Card'

const importButtonStyle = {
  display: 'block',
  border: '2px dotted #0076ffe6',
  backgroundColor: '#0076ff38',
  borderRadius: 9,
  color: 'blue',
  padding: '8px 0',
  textAlign: 'center',
  textDecoration: 'underline',
}

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
    this.workbook = null

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

    let data
    if (this.workbook) {
      const selectedSheetObj = this.workbook.Sheets[selectedSheet.value]
      const { json } = sheetToJson(selectedSheetObj)
      data = json
    }

    return (
      <div style={{ padding: 24, backgroundColor: '#e8ebec', flex: 1 }}>
        {/* TODO: Figure out ref logic to pull this into FileSelector.js */}
        <Card width={'50%'} title={'IMPORT SHEET'}>
          <div>
            <p style={{ fontWeight: 'bold' }}>Upload Excel File:</p>
            <label style={importButtonStyle}>
              Drag File Here or Click to Upload
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
            greatSuccess
              ? <div>IMPORT SUCCESSFUL</div>
              : (
                <>
                  <SheetSelector
                    sheetNames={sheetNames}
                    selectedSheet={selectedSheet}
                    handleSheetSelection={this.handleSheetSelection}
                  />
                  <CollectionSelector
                    selectedCollection={selectedCollection}
                    selectedSheet={selectedSheet}
                    handleCollectionSelection={this.handleCollectionSelection}
                  />
                  <SubmitButton
                    data={data}
                    selectedCollection={selectedCollection}
                    handleSuccess={this.handleSuccess}
                  />
                </>
              )
          }
        </Card>
        {isLoading && <Spinner />}
        {!_.isEmpty(data) && <TreatmentPlanManager data={data} />}
      </div>
    )

  }
}
export default Import
