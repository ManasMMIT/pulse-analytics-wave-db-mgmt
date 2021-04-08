import React from 'react'
import WorkbooksPanel from './WorkbooksPanel'
import SheetsPanel from './SheetsPanel'
import FieldsPanel from './FieldsPanel'

const SheetManagement = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <WorkbooksPanel />
      <SheetsPanel />
      <FieldsPanel />
    </div>
  )
}

export default SheetManagement
