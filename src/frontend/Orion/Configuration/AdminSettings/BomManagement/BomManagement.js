import React from 'react'
import BomsPanel from './BomsPanel'
import TabsPanel from './TabsPanel'
import SectionsPanel from './SectionsPanel'
import FieldsPanel from './FieldsPanel'

const BusinessObjectManagement = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', }}>
      <BomsPanel />
      <TabsPanel />
      <SectionsPanel />
      <FieldsPanel />
    </div>
  )
}

export default BusinessObjectManagement
