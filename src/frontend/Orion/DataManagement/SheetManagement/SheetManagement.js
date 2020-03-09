import React from 'react'
import WorkbooksPanel from './WorkbooksPanel'
import SheetsPanel from './SheetsPanel'
import FieldsPanel from './FieldsPanel'

const SheetManagement = () => {
  return (
    <div style={{ display: 'flex' }}>
      <WorkbooksPanel />
      <SheetsPanel />
      <FieldsPanel />
    </div>
  )
}

export default SheetManagement
