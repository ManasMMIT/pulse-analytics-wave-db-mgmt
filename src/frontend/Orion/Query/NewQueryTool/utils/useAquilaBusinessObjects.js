import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'

import {
  GET_AQUILA_BUSINESS_OBJECTS,
  GET_AQUILA_BO_FILTER_SETTINGS,
} from 'frontend/api/queries'

const useAquilaBusinessObjects = () => {
  const [
    getBusinessObjects,
    {
      data: businessObjectsData,
      loading: loadingBusinessObjects,
    }
  ] = useLazyQuery(GET_AQUILA_BUSINESS_OBJECTS)

  useEffect(getBusinessObjects, [])

  const [
    getBoFilterSettings,
    {
      data: boFilterSettingsData,
      loading: loadingBoFilterSettings,
    }
  ] = useLazyQuery(GET_AQUILA_BO_FILTER_SETTINGS)

  const aquilaBusinessObjects = businessObjectsData
    ? businessObjectsData.aquilaBusinessObjects
    : []
  const boFilterSettings = boFilterSettingsData
    ? boFilterSettingsData.aquilaBoFilterSettings
    : []

  const loading = loadingBusinessObjects || loadingBoFilterSettings

  return {
    data: {
      aquilaBusinessObjects,
      boFilterSettings,
    },
    loading,
    getBoFilterSettings,
  }
}

export default useAquilaBusinessObjects
