import React, { useState, useRef } from 'react'
import XLSX from 'xlsx'
// import PropTypes from 'prop-types'

import styled from '@emotion/styled'

import Spacing from '../../../../../utils/spacing'
import FontSpace from '../../../../../utils/fontspace'
import Color from '../../../../../utils/color'

const ImportSectionWrapper = styled.div({
  display: 'flex',
  width: '50%',
  padding: Spacing.S7,
  flexDirection: 'column',
  borderRight: `1px solid ${ Color.LIGHT_GRAY_1 }`,
  borderBottom: `1px solid ${ Color.LIGHT_GRAY_1 }`,
})

const Header = styled.h1({
  ...FontSpace.FS4
})

// TODO: Replace with button component
const Button = styled.button({
  color: Color.WHITE,
  backgroundColor: Color.BLUE,
  ...FontSpace.FS2,
  padding: `${ Spacing.S2 } ${ Spacing.S3 }`,
  borderRadius: '4px',
  fontWeight: 500,
  width: 'fit-content'
})

// TODO: Replace Input with input component
const InputWrapper = styled.div({
  margin: `${ Spacing.S7 } 0px`,
})

// TODO: Wire in import mutation
const ImportSection = props => {
  const fileInputRef = useRef(null)

  const [workbook, setWorkbook] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const onFileAdded = () => {
    setLoading(true)

    const file = fileInputRef.current.files[0]
    const reader = new FileReader()

    reader.onload = e => {
      const data = new Uint8Array(e.target.result)
      const nextWorkbook = XLSX.read(data, { type: 'array' })

      setWorkbook(nextWorkbook)
      setLoading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <ImportSectionWrapper>
      <Header>Import Data</Header>
      <InputWrapper>
        <b>Pick an Excel file:</b>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFileAdded}
          />
        </div>
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="select-timestamp"><b>Select Timestamp</b></label>
        <div>
          <input type="date" id="select-timestamp" name="select-timestamp" />
        </div>
      </InputWrapper>
      <Button>Import File</Button>
    </ImportSectionWrapper>
  )
}

// ImportSection.propTypes = {
  
// }

export default ImportSection