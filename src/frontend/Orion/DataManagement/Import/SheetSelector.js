import React from "react"
import PropTypes from 'prop-types'

import Select from 'react-select'

const SheetSelector = ({
  sheetNames,
  selectedSheet,
  handleSheetSelection,
}) => (
  <>
    <div style={{ marginTop: 24 }}>
      <p style={{ fontWeight: 700 }}>Select Sheets to Upload:</p>
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
