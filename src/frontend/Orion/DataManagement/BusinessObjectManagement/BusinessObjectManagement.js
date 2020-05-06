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

  /*
    if business objects are done loading, check params

    if there's no first param, businessObjectId, then push default first bo and field to history

    else if there's a bo param but no field param, check to see if bo param is valid.
      if bo param is valid, push the bo's first field to history.
      if bo param is not valid, push the default first bo and field to history.
  */
  useEffect(() => {
    if (!loading) {
      const firstBusinessObj = data.businessObjects[0]
      const firstField = firstBusinessObj.fields[0]

      if (!businessObjectId) {
        history.push(`bo-management/${firstBusinessObj._id}/${firstField._id}`)
      } else if (!fieldId) {
        const selectedBusObj = data.businessObjects
          .find(({ _id }) => _id.toString() === businessObjectId)

        if (selectedBusObj) {
          const selectedFieldId = selectedBusObj.fields[0]
            ? selectedBusObj.fields[0]._id
            : ' ' // ! still unclear why we need this

          history.push(selectedFieldId)
        } else {
          const newPathname = [firstBusinessObj._id, firstField._id].join('/')
          history.push(newPathname)
        }
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
