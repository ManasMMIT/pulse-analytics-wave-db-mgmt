import React from 'react'
import AquilaConfigsPanel from './AquilaConfigsPanel'
import FieldsPanel from './FieldsPanel'

const AquilaManagement = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <AquilaConfigsPanel />
      <FieldsPanel />
    </div>
  )
}

export default AquilaManagement
