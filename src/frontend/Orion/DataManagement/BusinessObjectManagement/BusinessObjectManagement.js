import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import BusinessObjectsPanel from './BusinessObjectsPanel'
import FieldsPanel from './FieldsPanel'
import { GET_BUSINESS_OBJECTS } from '../../../api/queries'

const BusinessObjectManagement = () => {
  const { data, loading } = useQuery(GET_BUSINESS_OBJECTS)

  const history = useHistory()
  const { businessObjectId, fieldId } = useParams()

  useEffect(() => {
    if (!loading) {
      const firstBusinessObj = data.businessObjects[0]
      const firstField = firstBusinessObj.fields[0]

      if (!businessObjectId) {
        history.push({
          pathname: `bo-management/${firstBusinessObj._id}/${firstField._id}`
        })
      } else if (!fieldId) {
        history.push({
          pathname: firstField._id
        })
      }
    }
  }, [loading, businessObjectId, fieldId])

  if (loading) return <div>Loading</div>

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', }}>
      <BusinessObjectsPanel />
      <FieldsPanel />
    </div>
  )
}

export default BusinessObjectManagement
