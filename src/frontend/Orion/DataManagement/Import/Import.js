import React from "react"
import XLSX from 'xlsx'
import styled from '@emotion/styled'

import sheetToJson from './sheetToJson'

import SheetSelector from './SheetSelector'
import CollectionSelector from './CollectionSelector'
import SubmitButton from './SubmitButton'

import TreatmentPlanManager from './TreatmentPlanManager'

import ValidationErrors from './ValidationErrors'

import Card from '../../../components/Card'

const Page = styled.div({
  padding: 24,
  backgroundColor: '#e8ebec',
  flex: 1,
  height: '100vh',
  overflowY: 'scroll',
  boxSizing: 'border-box',
})

const ImportButton = styled.label({
  display: 'block',
  border: '2px dotted #0076ffe6',
  backgroundColor: '#0076ff38',
  borderRadius: 9,
  color: 'blue',
  padding: '8px 0',
  textAlign: 'center',
  textDecoration: 'underline',
})

class Import extends React.Component {
  constructor(props) {
    super(props)

    this.fileInputRef = React.createRef()

    this.workbook = null
    this.jsonForImport = []

    this.state = {
      sheetNames: [],
      isLoading: false, // TODO: May not be needed anymore
      selectedSheet: null,
      selectedCollection: null,
      greatSuccess: false,
      errors: null,
      clicked: false,
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
          errors: null,
          clicked: false,
        })
      }, 1500)
    })
  }

  handleError = errors => {
    this.setState({ errors, clicked: false })
  }

  handleClick = () => {
    this.setState({ clicked: true })
  }

  render() {
    const {
      sheetNames,
      selectedSheet,
      selectedCollection,
      greatSuccess,
      clicked,
      errors,
    } = this.state

    let data, fileName
    if (this.workbook) {
      const selectedSheetObj = this.workbook.Sheets[selectedSheet.value]
      const { json } = sheetToJson(selectedSheetObj)
      data = json
      fileName = this.fileInputRef.current.files[0].name
    }
    return (
      <Page>
        {/* TODO: Figure out ref logic to pull this into FileSelector.js */}
        <div style={{ display: 'flex' }}>
          <Card width={'50%'} title={'IMPORT SHEET'}>
            <div>
              <p style={{ fontWeight: 'bold' }}>Upload Excel File:</p>
              <ImportButton>
                { fileName || 'Drag File Here or Click to Upload'}
                <input
                  style={{ display: 'none' }}
                  ref={this.fileInputRef}
                  type="file"
                  multiple
                  onChange={this.onFilesAdded}
                />
              </ImportButton>
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
                      handleError={this.handleError}
                      handleClick={this.handleClick}
                      clicked={clicked}
                      greatSuccess={greatSuccess}
                      selectedSheet={selectedSheet}
                    />
                  </>
                )
            }
          </Card>
          <Card width={'50%'} title={"SYSTEM STATUS"}>
            {errors && (
              <div style={{ color: 'red' }}>
                <div>
                  <ul>
                    {
                      errors.map(({ message }) => (
                        <li key={message}>
                          {message}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>)
            }
          </Card>
        </div>
        <Card>
          <ValidationErrors errors={errors} />
          <TreatmentPlanManager data={data} />
        </Card>
      </Page>
    )
  }
}

export default Import
