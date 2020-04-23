import React from 'react'
import BusinessObjectsPanel from './BusinessObjectsPanel'
import FieldsPanel from './FieldsPanel'

const BusinessObjectManagement = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', }}>
      <BusinessObjectsPanel />
      <FieldsPanel />
    </div>
  )
}

export default BusinessObjectManagement
