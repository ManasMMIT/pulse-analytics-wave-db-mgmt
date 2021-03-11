import { useLazyQuery, useQuery } from '@apollo/client'

import {
  GET_AQUILA_BUSINESS_OBJECTS,
  GET_AQUILA_BO_FILTER_SETTINGS,
} from 'frontend/api/queries'

const useAquilaBusinessObjects = () => {
  const {
    data: aquilaBusinessObjectsData,
    loading: loadingAquilaBusinessObjects,
  } = useQuery(GET_AQUILA_BUSINESS_OBJECTS)

  const [
    getBoFilterSettings,
    {
      data: boFilterSettingsData,
      loading: loadingBoFilterSettings,
    }
  ] = useLazyQuery(GET_AQUILA_BO_FILTER_SETTINGS)

  const aquilaBusinessObjects = aquilaBusinessObjectsData
    ? aquilaBusinessObjectsData.aquilaBusinessObjects
    : null // ! used in dependency array, so an empty array would trigger infinite renders
  const boFilterSettings = boFilterSettingsData
    ? boFilterSettingsData.aquilaBoFilterSettings
    : []

  const loading = loadingAquilaBusinessObjects || loadingBoFilterSettings

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
