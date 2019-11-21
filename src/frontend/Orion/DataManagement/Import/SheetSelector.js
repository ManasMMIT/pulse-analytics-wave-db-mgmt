import React from "react"
import PropTypes from 'prop-types'

import Select from 'react-select'

import ImportSelectLabel from './ImportSelectLabel'

const SheetSelector = ({
  sheetNames,
  selectedSheet,
  handleSheetSelection,
}) => (
  <>
    <div style={{ marginTop: 24 }}>
      <ImportSelectLabel label="Select Sheets to Upload:" />
      {
        <Select
          value={selectedSheet}
          onChange={handleSheetSelection}
          options={sheetNames.map(n => ({ value: n, label: n }))}
        />
      }
    </div>
  </>
)

SheetSelector.propTypes = {
  sheetNames: PropTypes.array,
  selectedSheet: PropTypes.object,
  handleSheetSelection: PropTypes.func,
}

export default SheetSelector
