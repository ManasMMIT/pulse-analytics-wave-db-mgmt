import React from 'react'
import WorkbooksPanel from './WorkbooksPanel'
import SheetsPanel from './SheetsPanel'
import FieldsPanel from './FieldsPanel'
import EditFieldPanel from './EditFieldPanel/EditFieldPanel'

const SheetManagement = () => {
  return (
    <div style={{ display: 'flex' }}>
      <WorkbooksPanel />
      <SheetsPanel />
      <FieldsPanel />
      <EditFieldPanel />
    </div>
  )
}

export default SheetManagement
