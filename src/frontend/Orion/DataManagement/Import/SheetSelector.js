import React from "react"
import PropTypes from 'prop-types'

import _ from 'lodash'

import Select from 'react-select'

const SheetSelector = ({
  sheetNames,
  selectedSheet,
  handleSheetSelection,
}) => (
  <>
    {
      (_.isEmpty(sheetNames) || (
        <div style={{ marginTop: 24, width: 500 }}>
          <p>Sheets to Upload:</p>
          {
            <Select
              value={selectedSheet}
              onChange={handleSheetSelection}
              options={sheetNames.map(n => ({ value: n, label: n }))}
            />
          }
        </div>
      ))
    }
  </>
)

SheetSelector.propTypes = {
  sheetNames: PropTypes.array,
  selectedSheet: PropTypes.object,
  handleSheetSelection: PropTypes.func,
}

export default SheetSelector
